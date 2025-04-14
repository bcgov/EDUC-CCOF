(require '[babashka.http-client :as http])
(require '[cheshire.core :as json])

(def env-vars {:env (System/getenv "KC_ENV")
               :app-name (System/getenv "APP_NAME")
               :realm-id (System/getenv "KC_REALM_ID")
               :admin-client-id (System/getenv "KC_CLIENT_ID")
               :admin-client-secret (System/getenv "KC_CLIENT_SECRET")})

(when (some empty? (vals env-vars))
  (throw (Throwable. "Environment variables may be missing")))

(def kc-base-url (let [env (:env env-vars)]
                   (str "https://"
                        (when (not (= "prod" env))
                          (str env ".")) "loginproxy.gov.bc.ca")))
(def kc-admin-url (str kc-base-url "/auth/admin/realms/" (:realm-id env-vars)))
(def kc-base-client-map
  (let [env (:env env-vars)
        app (:app-name env-vars)
        root-url (str "https://"
                      (when (not (= "prod" env))
                        (str env ".")) "mychildcareservices.gov.bc.ca/*")]
    {:description (str (str/upper-case app) " login client")
     :consentRequired false
     :clientId (str app "-" env)
     :adminUrl root-url
     :frontchannelLogout false
     :redirectUris (cond
                     (= env "dev") ["https://dev.mychildcareservices.gov.bc.ca/*"
                                    "http://localhost*"
                                    "https://qa.mychildcareservices.gov.bc.ca/*"]
                     (= env "test") ["https://uat.mychildcareservices.gov.bc.ca/*"
                                     "https://efx.mychildcareservices.gov.bc.ca/*"]
                     (= env "prod") ["https://mychildcareservices.gov.bc.ca/*"]
                     :else [])
     :publicClient false
     :protocolMappers [{:name "idir_username"
                        :protocol "openid-connect"
                        :protocolMapper "oidc-usermodel-attribute-mapper"
                        :consentRequired false
                        :config {:user.attribute "idir_username"
                                 :id.token.claim true
                                 :access.token.claim true
                                 :claim.name "idir_username"
                                 :jsonType.label "String"
                                 :userinfo.token.claim true}}
                       {:name "bceid_username"
                        :protocol "openid-connect"
                        :protocolMapper "oidc-usermodel-attribute-mapper"
                        :consentRequired false
                        :config {:user.attribute "bceid_username"
                                 :id.token.claim true
                                 :access.token.claim true
                                 :claim.name "bceid_username"
                                 :jsonType.label "String"
                                 :userinfo.token.claim true}}]
     :fullScopeAllowed true
     :protocol "openid-connect"
     :surrogateAuthRequired false
     :serviceAccountsEnabled false
     :name (str/upper-case app)
     :rootUrl root-url
     :clientAuthenticatorType "client-secret"
     :baseUrl ""
     :notBefore 0
     :authenticationFlowBindingOverrides {}
     :standardFlowEnabled true
     :access {:view true
              :configure true
              :manage true}
     :implicitFlowEnabled false
     :directAccessGrantsEnabled true
     :nodeReRegistrationTimeout -1
     :alwaysDisplayInConsole false
     :optionalClientScopes ["address"
                            "phone"
                            "offline_access"
                            "microprofile-jwt"]
     :attributes {:saml.multivalued.roles false
                  :saml.artifact.binding false
                  :saml.onetimeuse.condition false
                  :saml.server.signature false
                  :acr.loa.map "{}"
                  :saml.allow.ecp.flow false
                  :display.on.consent.screen false
                  :backchannel.logout.revoke.offline.tokens false
                  :saml_force_name_id_format false
                  :backchannel.logout.session.required true
                  :saml.force.post.binding false
                  :realm_client false
                  :exclude.session.state.from.auth.response false
                  :saml.server.signature.keyinfo.ext false
                  :require.pushed.authorization.requests false
                  :oidc.ciba.grant.enabled false
                  :saml.client.signature false
                  :post.logout.redirect.uris "+"
                  :id.token.as.detached.signature false
                  :saml.authnstatement false
                  :saml.encrypt false
                  :tls.client.certificate.bound.access.tokens false
                  :use.refresh.tokens true
                  :token.response.type.bearer.lower-case false
                  :frontchannel.logout.session.required false
                  :client.secret.creation.time "1713990984"
                  :client_credentials.use_refresh_token false
                  :oauth2.device.authorization.grant.enabled false
                  :saml.assertion.signature false}
     :enabled true
     :bearerOnly false
     :defaultClientScopes ["web-origins"
                           "acr"
                           "profile"
                           "roles"
                           "basic"
                           "email"]
     :webOrigins [root-url]}))

(defn call-token-endpoint []
  (printf "Calling the token endpoint for an access token\n")
  (http/post (str kc-base-url
                  "/auth/realms/childcare-applications"
                  "/protocol/openid-connect/token")
             {:form-params {"grant_type" "client_credentials"
                            "client_id" (:admin-client-id env-vars)
                            "client_secret" (:admin-client-secret env-vars)}}))

(defn get-access-token [response]
  (let [response_body (:body response)]
    (get (json/decode response_body) "access_token")))

(defn get-client [token client-id]
  (printf (str "Finding the client with get-client\n"))
  (let [res (http/get (str kc-admin-url "/clients")
                      {:headers {:Authorization (str "Bearer " token)}})]
    (->> (json/parse-string (:body res) true)
         (filter #(= (:clientId %) client-id))
         first)))

(defn delete-client-if-exists [token client-id]
  (if (not (empty? client-id))
    (do
      (printf "Deleting an existing client-id with delete-client-id-if-exists\n")
      (http/delete (str kc-admin-url "/clients/" client-id)
                   {:headers {:Authorization (str "Bearer " token)}}))
    (printf (str "The client-id in delete-client-if-exists is empty. "
                 "No client to delete?\n"))))

(defn create-client [token secret]
  (let [body-map (if (empty? secret)
                   kc-base-client-map
                   (merge kc-base-client-map {:secret secret}))]
    (printf "Creating keycloak client\n")
    (http/post (str kc-admin-url "/clients")
               {:headers {:Authorization (str "Bearer " token)}
                :body (json/encode body-map)})))

;;; Procedure starts here
(let [token (-> (call-token-endpoint)
                get-access-token)
      client-name (str (:app-name env-vars) "-" (:env env-vars))
      client (get-client token client-name)]
  (delete-client-if-exists token (:id client))
  (create-client token (:secret client)))

(printf "Keycloak client setup complete\n")
