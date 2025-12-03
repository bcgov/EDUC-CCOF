function getEnvVars() {
  return {
    env: process.env.KC_ENV,
    appName: process.env.APP_NAME,
    realmId: process.env.KC_REALM_ID,
    adminClientId: process.env.KC_CLIENT_ID,
    adminClientSecret: process.env.KC_CLIENT_SECRET,
  };
}

function checkEnvVars(envVars) {
  for (const value of Object.values(envVars)) {
    if (!value) {
      throw new Error("Environment variables may be missing");
    }
  }
}

function getKcBaseUrl(env) {
  let prefix = "";
  if (env !== "prod") {
    prefix = `${env}.`;
  }
  return `https://${prefix}loginproxy.gov.bc.ca`;
}

function getKcAdminUrl(baseUrl, realmId) {
  return `${baseUrl}/auth/admin/realms/${realmId}`;
}

function getExplicitRedirectEndpoints(rootUrl) {
  return [
    `${rootUrl}/api/auth/callback`,
    `${rootUrl}/api/auth/callback_idir`,
    `${rootUrl}/logout?idir=true`,
    `${rootUrl}/logout?idir=false`,
    `${rootUrl}/session-expired?idir=true`,
    `${rootUrl}/session-expired?idir=false`,
  ]
}

function getKcBaseClientMap(envVars) {
  const env = envVars.env;
  const app = envVars.appName;

  let redirectUris = [];
  if (env === "dev") {
    redirectUris = [
      "http://localhost*",
      "https://dev.mychildcareservices.gov.bc.ca/*",
      ...getExplicitRedirectEndpoints("https://qa.mychildcareservices.gov.bc.ca")
    ];
  } else if (env === "test") {
    redirectUris = [
      ...getExplicitRedirectEndpoints("https://test.mychildcareservices.gov.bc.ca"),
      ...getExplicitRedirectEndpoints("https://efx.mychildcareservices.gov.bc.ca"),
    ];
  } else if (env === "prod") {
    redirectUris = getExplicitRedirectEndpoints("https://mychildcareservices.gov.bc.ca");
  }

  return {
    description: `${app.toUpperCase()} login client`,
    consentRequired: false,
    clientId: `${app}-${env}`,
    adminUrl: "",
    frontchannelLogout: false,
    redirectUris: redirectUris,
    publicClient: false,
    protocolMappers: [
      {
        name: "guid",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-attribute-mapper",
        consentRequired: false,
        config: {
          "user.attribute": "guid",
          "id.token.claim": true,
          "access.token.claim": true,
          "claim.name": "guid",
          "jsonType.label": "String",
          "userinfo.token.claim": true,
        },
      },
      {
        name: "identity_provider",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-attribute-mapper",
        consentRequired: false,
        config: {
          "user.attribute": "identity_provider",
          "id.token.claim": true,
          "access.token.claim": true,
          "claim.name": "identity_provider",
          "jsonType.label": "String",
          "userinfo.token.claim": true,
        },
      },
      {
        name: "idir_username",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-attribute-mapper",
        consentRequired: false,
        config: {
          "user.attribute": "idir_username",
          "id.token.claim": true,
          "access.token.claim": true,
          "claim.name": "idir_username",
          "jsonType.label": "String",
          "userinfo.token.claim": true,
        },
      },
      {
        name: "bceid_username",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-attribute-mapper",
        consentRequired: false,
        config: {
          "user.attribute": "bceid_username",
          "id.token.claim": true,
          "access.token.claim": true,
          "claim.name": "bceid_username",
          "jsonType.label": "String",
          "userinfo.token.claim": true
        },
      },
    ],
    fullScopeAllowed: true,
    protocol: "openid-connect",
    surrogateAuthRequired: false,
    serviceAccountsEnabled: false,
    name: app.toUpperCase(),
    rootUrl: "",
    clientAuthenticatorType: "client-secret",
    baseUrl: "",
    notBefore: 0,
    authenticationFlowBindingOverrides: {},
    standardFlowEnabled: true,
    access: { view: true, configure: true, manage: true },
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: true,
    nodeReRegistrationTimeout: -1,
    alwaysDisplayInConsole: false,
    optionalClientScopes: [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt",
    ],
    attributes: {
      "saml.multivalued.roles": false,
      "saml.artifact.binding": false,
      "saml.onetimeuse.condition": false,
      "saml.server.signature": false,
      "acr.loa.map": "{}",
      "saml.allow.ecp.flow": false,
      "display.on.consent.screen": false,
      "backchannel.logout.revoke.offline.tokens": false,
      "saml_force_name_id_format": false,
      "backchannel.logout.session.required": true,
      "saml.force.post.binding": false,
      "realm_client": false,
      "exclude.session.state.from.auth.response": false,
      "saml.server.signature.keyinfo.ext": false,
      "require.pushed.authorization.requests": false,
      "oidc.ciba.grant.enabled": false,
      "saml.client.signature": false,
      "post.logout.redirect.uris": "+",
      "id.token.as.detached.signature": false,
      "saml.authnstatement": false,
      "saml.encrypt": false,
      "tls.client.certificate.bound.access.tokens": false,
      "use.refresh.tokens": true,
      "token.response.type.bearer.lower-case": false,
      "frontchannel.logout.session.required": false,
      "client.secret.creation.time": "1713990984",
      "client_credentials.use_refresh_token": false,
      "oauth2.device.authorization.grant.enabled": false,
      "saml.assertion.signature": false,
    },
    enabled: true,
    bearerOnly: false,
    defaultClientScopes: [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email",
    ],
    webOrigins: ["+"],
  };
}

async function getAccessToken(kcBaseUrl, adminClientId, adminClientSecret) {
  console.log("Calling the token endpoint for an access token");
  const response = await fetch(
    `${kcBaseUrl}/auth/realms/childcare-applications/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: adminClientId,
        client_secret: adminClientSecret,
      }),
    },
  );
  const data = await response.json();
  return data.access_token;
}

async function getClient(token, kcAdminUrl, clientId) {
  console.log(`Getting ${clientId} with getClient`);
  const response = await fetch(`${kcAdminUrl}/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const clients = await response.json();
  return clients.find((c) => c.clientId === clientId);
}

async function deleteClientIfExists(token, kcAdminUrl, id, clientId) {
  console.log(`Attempting to delete client: ${clientId}`);
  await fetch(`${kcAdminUrl}/clients/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function createClient(token, kcAdminUrl, clientMap) {
  const { clientId } = clientMap;
  console.log(`Creating keycloak client: ${clientId}`);
  const response = await fetch(`${kcAdminUrl}/clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientMap),
  });

  if (response.status >= 400) {
    const { status, statusText } = response;
    throw new Error(`An error ocurred while creating ${clientId}.\nStatus: ${status}\nMessage: ${statusText}`);
  };
}

export async function main() {
  const envVars = getEnvVars();
  checkEnvVars(envVars);

  const kcBaseUrl = getKcBaseUrl(envVars.env);
  const kcAdminUrl = getKcAdminUrl(kcBaseUrl, envVars.realmId);
  let kcBaseClientMapVar = getKcBaseClientMap(envVars);

  const token = await getAccessToken(
    kcBaseUrl,
    envVars.adminClientId,
    envVars.adminClientSecret,
  );
  const clientName = `${envVars.appName}-${envVars.env}`;
  const client = await getClient(token, kcAdminUrl, clientName);

  if (!client) {
    console.log(`Client ${clientName} does not yet exist`);
  } else {
    await deleteClientIfExists(token, kcAdminUrl, client.id, client.clientId);
  }

  await createClient(
    token,
    kcAdminUrl,
    client
      ? Object.assign(kcBaseClientMapVar, { secret: client.secret })
      : kcBaseClientMapVar,
  );

  console.log("Keycloak client setup complete");
}
