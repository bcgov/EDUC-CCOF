ENV_VAL=$1
APP_NAME=$2
OPENSHIFT_NAMESPACE=$3
SPLUNK_TOKEN=$4

NAMESPACE_SUFFIX="$ENV_VAL"
if [ "$ENV_VAL" = "dev" ] || [ "$ENV_VAL" = "qa" ]; then
  NAMESPACE_SUFFIX="dev"
fi
readonly NAMESPACE_SUFFIX

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

echo Creating config map $APP_NAME-flb-sc-config-map
oc create -n "$OPENSHIFT_NAMESPACE-$NAMESPACE_SUFFIX" configmap "$APP_NAME-flb-sc-config-map" \
--from-literal=fluent-bit.conf="$FLB_CONFIG" \
--from-literal=parsers.conf="$PARSER_CONFIG" \
--dry-run -o yaml | oc apply -f -
