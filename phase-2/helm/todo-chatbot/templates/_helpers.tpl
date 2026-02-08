{{/*
Backend service name (used by frontend to call API)
*/}}
{{- define "todo-chatbot.backendHost" -}}
{{ .Release.Name }}-backend:{{ .Values.backend.service.port }}
{{- end }}
