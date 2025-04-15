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

function getKcBaseClientMap(envVars) {
  const env = envVars.env;
  const app = envVars.appName;
  let prefix = "";
  if (env !== "prod") {
    prefix = `${env}.`;
  }
  const rootUrl = `https://${prefix}mychildcareservices.gov.bc.ca/*`;

  let redirectUris = [];
  if (env === "dev") {
    redirectUris = [
      "https://dev.mychildcareservices.gov.bc.ca/*",
      "http://localhost*",
      "https://qa.mychildcareservices.gov.bc.ca/*",
    ];
  } else if (env === "test") {
    redirectUris = [
      "https://uat.mychildcareservices.gov.bc.ca/*",
      "https://efx.mychildcareservices.gov.bc.ca/*",
    ];
  } else if (env === "prod") {
    redirectUris = ["https://mychildcareservices.gov.bc.ca/*"];
  }

  return {
    description: `${app.toUpperCase()} login client`,
    consentRequired: false,
    clientId: `${app}-${env}`,
    adminUrl: rootUrl,
    frontchannelLogout: false,
    redirectUris: redirectUris,
    publicClient: false,
    protocolMappers: [
      {
        name: "idir_username",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-attribute-mapper",
        consentRequired: false,
        config: {
          userAttribute: "idir_username",
          idTokenClaim: true,
          accessTokenClaim: true,
          claimName: "idir_username",
          jsonTypeLabel: "String",
          userinfoTokenClaim: true,
        },
      },
      {
        name: "bceid_username",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-attribute-mapper",
        consentRequired: false,
        config: {
          userAttribute: "bceid_username",
          idTokenClaim: true,
          accessTokenClaim: true,
          claimName: "bceid_username",
          jsonTypeLabel: "String",
          userinfoTokenClaim: true,
        },
      },
    ],
    fullScopeAllowed: true,
    protocol: "openid-connect",
    surrogateAuthRequired: false,
    serviceAccountsEnabled: false,
    name: app.toUpperCase(),
    rootUrl: rootUrl,
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
      samlMultivaluedRoles: false,
      samlArtifactBinding: false,
      samlOnetimeuseCondition: false,
      samlServerSignature: false,
      acrLoaMap: "{}",
      samlAllowEcpFlow: false,
      displayOnConsentScreen: false,
      backchannelLogoutRevokeOfflineTokens: false,
      samlForceNameIdFormat: false,
      backchannelLogoutSessionRequired: true,
      samlForcePostBinding: false,
      realmClient: false,
      excludeSessionStateFromAuthResponse: false,
      samlServerSignatureKeyinfoExt: false,
      requirePushedAuthorizationRequests: false,
      oidcCibaGrantEnabled: false,
      samlClientSignature: false,
      postLogoutRedirectUris: "+",
      idTokenAsDetachedSignature: false,
      samlAuthnstatement: false,
      samlEncrypt: false,
      tlsClientCertificateBoundAccessTokens: false,
      useRefreshTokens: true,
      tokenResponseTypeBearerLowerCase: false,
      frontchannelLogoutSessionRequired: false,
      clientSecretCreationTime: "1713990984",
      clientCredentialsUseRefreshToken: false,
      oauth2DeviceAuthorizationGrantEnabled: false,
      samlAssertionSignature: false,
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
    webOrigins: [rootUrl],
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

async function deleteClientIfExists(token, kcAdminUrl, id, clientId = undefined) {
  if (clientId) {
    console.log(`Attempting to delete client: ${clientId}`);
  }
  if (!id) {
    console.log(
      `The id called with deleteClientIfExists is empty. No client to delete?`,
    );
    return;
  }
  console.log(`Deleting ${clientId ? clientId : 'the existing client'} by id with deleteClientIfExists`);
  await fetch(`${kcAdminUrl}/clients/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function createClient(token, kcAdminUrl, clientMap) {
  console.log(`Creating keycloak client: ${clientMap.clientId}`);
  await fetch(`${kcAdminUrl}/clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientMap),
  });
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

  await deleteClientIfExists(token, kcAdminUrl, client ? client.id : null, client?.clientId);

  await createClient(
    token,
    kcAdminUrl,
    client
      ? Object.assign(kcBaseClientMapVar, { secret: client.secret })
      : kcBaseClientMapVar,
  );

  console.log("Keycloak client setup complete");
}
