{{- define "axiom-topology.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "axiom-topology.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "axiom-topology.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "axiom-topology.labels" -}}
helm.sh/chart: {{ include "axiom-topology.chart" . }}
{{ include "axiom-topology.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "axiom-topology.selectorLabels" -}}
app.kubernetes.io/name: {{ include "axiom-topology.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "axiom-topology.backendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "axiom-topology.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "axiom-topology.frontendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "axiom-topology.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "axiom-topology.ryuSelectorLabels" -}}
app.kubernetes.io/name: {{ include "axiom-topology.name" . }}-ryu
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
