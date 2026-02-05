set -euo pipefail

readonly ENV_VAL=$1
readonly APP_NAME=$2
readonly NAMESPACE_PREFIX=$3
readonly COMMON_NAMESPACE=$4
readonly SOAM_CLIENT_ID=$5
readonly SOAM_CLIENT_SECRET=$6
readonly SOAM_IDP_HINT_BCEID=$7
readonly SOAM_IDP_HINT_IDIR=$8
readonly SPLUNK_TOKEN=$9
readonly D365_API_PREFIX=${10}
readonly D365_API_KEY_HEADER=${11}
readonly D365_API_KEY_VALUE=${12}
readonly CANADA_POST_API_ENDPOINT=${13}
readonly CANADA_POST_API_KEY=${14}
readonly SOAM_KC_REALM_ID="childcare-applications"
readonly D365_API_ENDPOINT="http://$D365_API_PREFIX-$ENV_VAL:5091"
readonly TIMEZONE="America/Vancouver"
readonly NODE_ENV='openshift'

NAMESPACE_SUFFIX="$ENV_VAL"
if [ "$ENV_VAL" = "dev" ] || [ "$ENV_VAL" = "qa" ]; then
  NAMESPACE_SUFFIX="dev"
elif [ "$ENV_VAL" = "uat" ] || [ "$ENV_VAL" = "efx" ]; then
  NAMESPACE_SUFFIX="test"
elif [ "$ENV_VAL" = "prod" ]; then
  NAMESPACE_SUFFIX="prod"
fi
readonly NAMESPACE_SUFFIX

SITE_MINDER_LOGOUT_URL=""
if [ "$ENV_VAL" != "prod" ]
then
  SITE_MINDER_LOGOUT_URL="https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
else
  SITE_MINDER_LOGOUT_URL="https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
fi
readonly SITE_MINDER_LOGOUT_URL

SOAM_KC="loginproxy.gov.bc.ca"
SERVER_FRONTEND='https://mychildcareservices.gov.bc.ca'
if [ "$ENV_VAL" != "prod" ]; then
  SOAM_KC="$NAMESPACE_SUFFIX.loginproxy.gov.bc.ca"

  if [ "$ENV_VAL" = "uat" ]; then
    SERVER_FRONTEND="https://test.mychildcareservices.gov.bc.ca"
  else
    SERVER_FRONTEND="https://$ENV_VAL.mychildcareservices.gov.bc.ca"
  fi
fi
readonly SOAM_KC
readonly SERVER_FRONTEND

LOG_LEVEL="verbose"
if [ "$ENV_VAL" = "prod" ]; then
  LOG_LEVEL="info"
fi
readonly LOG_LEVEL

readonly OPENSHIFT_NAMESPACE="$NAMESPACE_PREFIX-$NAMESPACE_SUFFIX"

echo Fetching one-liner public key from SOAM
SOAM_ONE_LINE_KEY=$(curl -sX GET "https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID" \
  | jq -r .public_key)
readonly SOAM_ONE_LINE_KEY

echo Formatting public key from SOAM
FORMATTED_SOAM_PUBLIC_KEY=$(cat << PUBKEY
-----BEGIN PUBLIC KEY-----
$(echo "$SOAM_ONE_LINE_KEY" | fold -w64)
-----END PUBLIC KEY-----
PUBKEY
)
readonly FORMATTED_SOAM_PUBLIC_KEY
echo "$FORMATTED_SOAM_PUBLIC_KEY"

echo Generating private and public keys
ssh-keygen -b 4096 -t rsa -f tempPenBackendkey -m pem -q -N ""
UI_PRIVATE_KEY_VAL="$(cat tempPenBackendkey)"
UI_PUBLIC_KEY_VAL="$(ssh-keygen -f tempPenBackendkey -e -m pem)"
readonly UI_PRIVATE_KEY_VAL
readonly UI_PUBLIC_KEY_VAL

echo Removing key files
rm tempPenBackendkey
rm tempPenBackendkey.pub

echo Creating config map "$APP_NAME-backend-config-map"
oc create -n "$OPENSHIFT_NAMESPACE" configmap \
  "$APP_NAME-backend-$ENV_VAL-config-map" \
  --from-literal="CLAMAV_HOST=clamav.$COMMON_NAMESPACE-$NAMESPACE_SUFFIX.svc.cluster.local" \
  --from-literal="D365_API_ENDPOINT=$D365_API_ENDPOINT" \
  --from-literal="D365_API_KEY_HEADER=$D365_API_KEY_HEADER" \
  --from-literal="D365_API_KEY_VALUE=$D365_API_KEY_VALUE" \
  --from-literal="LOG_LEVEL=$LOG_LEVEL" \
  --from-literal="TZ=$TIMEZONE" \
  --from-literal="NODE_ENV=$NODE_ENV" \
  --from-literal="REDIS_USE_CLUSTERED=true" \
  --from-literal="REDIS_HOST=redis" \
  --from-literal="REDIS_PORT=6379" \
  --from-literal="REDIS_FACILITY_TTL=600" \
  --from-literal="REDIS_PREFIX=$ENV_VAL:" \
  --from-literal="SERVER_FRONTEND=$SERVER_FRONTEND" \
  --from-literal="SERVER_PORT=8080" \
  --from-literal="SITEMINDER_LOGOUT_ENDPOINT=$SITE_MINDER_LOGOUT_URL" \
  --from-literal="SOAM_DISCOVERY=https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/.well-known/openid-configuration" \
  --from-literal="SOAM_CLIENT_ID=$SOAM_CLIENT_ID" \
  --from-literal="SOAM_CLIENT_SECRET=$SOAM_CLIENT_SECRET" \
  --from-literal="SOAM_IDP_HINT_BCEID=$SOAM_IDP_HINT_BCEID" \
  --from-literal="SOAM_IDP_HINT_IDIR=$SOAM_IDP_HINT_IDIR" \
  --from-literal="SOAM_PUBLIC_KEY=$FORMATTED_SOAM_PUBLIC_KEY" \
  --from-literal="SOAM_URL=https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/protocol/openid-connect/logout" \
  --from-literal="UI_PRIVATE_KEY=$UI_PRIVATE_KEY_VAL" \
  --from-literal="UI_PUBLIC_KEY=$UI_PUBLIC_KEY_VAL" \
  --from-literal="CLAMAV_PORT=3310" \
  --from-literal="ISSUER=EDUC_CCOF" \
  --from-literal="CANADA_POST_API_ENDPOINT=$CANADA_POST_API_ENDPOINT" \
  --from-literal="CANADA_POST_API_KEY=$CANADA_POST_API_KEY" \
  --dry-run=client -o yaml | oc apply --wait -f -

echo
echo Setting environment variables for "$APP_NAME-backend-$ENV_VAL" application
oc -n "$OPENSHIFT_NAMESPACE" set env \
  --from="configmap/$APP_NAME-backend-$ENV_VAL-config-map" \
  "deployment/$APP_NAME-backend-$ENV_VAL"

if [ "$ENV_VAL" != 'qa' ]; then
    SPLUNK_URL="gww.splunk.educ.gov.bc.ca"
    FLB_CONFIG="[SERVICE]
   Flush        1
   Daemon       Off
   Log_Level    debug
   HTTP_Server   On
   HTTP_Listen   0.0.0.0
   Parsers_File parsers.conf
[INPUT]
   Name   tail
   Path   /mnt/log/*
   Parser docker
   Mem_Buf_Limit 20MB
[FILTER]
   Name record_modifier
   Match *
   Record hostname \${HOSTNAME}
[OUTPUT]
   Name   stdout
   Match  *
[OUTPUT]
   Name  splunk
   Match *
   Host  $SPLUNK_URL
   Port  443
   TLS         On
   TLS.Verify  Off
   Message_Key $APP_NAME
   Splunk_Token $SPLUNK_TOKEN
"
    PARSER_CONFIG="
[PARSER]
    Name        docker
    Format      json
"

    echo Creating config map "$APP_NAME-flb-sc-config-map"
    oc create -n "$OPENSHIFT_NAMESPACE" \
       configmap "$APP_NAME-flb-sc-config-map" \
       --from-literal=fluent-bit.conf="$FLB_CONFIG" \
       --from-literal=parsers.conf="$PARSER_CONFIG" \
       --dry-run=client -o yaml | oc apply -f -
fi

