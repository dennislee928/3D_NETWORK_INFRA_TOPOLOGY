 # 3D Network Infra Topology

本專案用於建置與展示「3D 網路基礎建設拓樸圖」，協助理解實體與邏輯網路元件之間的關係，方便進行架構設計、容量規劃與事件調查。

> 提示：請依實際技術棧（例如 React/Three.js、Next.js、Go、Python 等）補完下列章節內容。

---

## 專案簡介

- **目標**：以 3D 方式可視化網路基礎設施（如路由器、交換器、防火牆、伺服器、雲資源）。
- **用途**：
  - 架構溝通與簡報
  - 故障排除與事件調查輔助
  - 容量與風險評估
- **重點**：
  - 以視覺化方式呈現節點與連線
  - 支援互動（縮放、旋轉、點擊節點檢視細節）
  - 可擴充匯入真實環境拓樸資料

---

## 環境需求

請依實際專案更新：

- **語言／Runtime**：如 Node.js `>= 20`、Python `>= 3.11`、Go `>= 1.22` 等
- **套件管理**：如 `npm` / `pnpm` / `yarn`、`pip`、`go mod`
- **其他依賴**：如 `Docker`, `docker-compose`, `make`

---

## 安裝與啟動

以下提供通用範例，請依實際專案調整：

```bash
git clone https://github.com/dennislee928/3D_NETWORK_INFRA_TOPOLOGY.git
cd 3D_NETWORK_INFRA_TOPOLOGY

# 例如：前端
npm install
npm run dev

# 或後端服務
go mod tidy
go run ./cmd/server
```

請將上方命令改為專案實際的啟動流程（可區分 `frontend` / `backend` / `infra` 等資料夾）。

---

## 專案結構（建議）

實際目錄可能不同，請依專案調整：

- `docs/`：設計文件、ERD、架構圖
- `infra/`：基礎建設與 IaC（如 Terraform、Ansible）
- `backend/`：API / 資料服務
- `frontend/`：3D 視覺化前端（例如 Three.js、React Three Fiber）
- `scripts/`：工具腳本（build、deploy、資料匯入等）

---

## 開發流程與規範

- **程式風格**：遵守語言社群慣例（如 Go 命名、TypeScript 型別嚴謹等）。
- **安全性**：
  - 避免在程式碼庫中提交明文密碼與金鑰（使用 `.env` 或 Secret Manager）。
  - API 請實作認證與授權機制。
  - 日誌中需匿名化敏感資料（IP、使用者識別資訊等）。
- **測試**：
  - 新增功能需搭配單元測試。
  - 重要路徑須有整合測試／端到端測試。

---

## 部署與營運（示意）

請依實際架構補充：

- **環境**：`dev` / `staging` / `production`
- **部署方式**：如 Docker / Kubernetes / Serverless / 雲端 PaaS
- **監控與日誌**：
  - 指標：延遲、錯誤率、資源使用量
  - 日誌需去識別化並符合隱私／法規要求

---

##  啟動與測試



A. 啟動所有服務 (這可能需要幾分鐘，因為 ODL 啟動較慢)
   1 docker-compose up -d --build

  B. 進入 Mininet 容器並建立拓樸
  一旦 OpenDaylight 的 healthcheck 通過，進入 mininet_network 容器：
   1 docker exec -it mininet_network bash

  在容器內執行 mn 命令，將模擬網路連向 ODL 容器 (透過 Docker DNS 名稱 opendaylight)：

   1 # 建立一個包含 1 個 Switch、3 個 Host 的星型拓樸
   2 mn --controller=remote,ip=opendaylight,port=6633 --topo=single,3

  C. 驗證
   1. 在 Mininet 中執行 pingall，確保 Host 之間可以連通。
   2. 查看前端 3D 拓樸：實體層 (Physical Realm) 應該會出現 1 個 Switch 與 3 個 Host，並且這 3 個 Host 會連向 Switch。

  為什麼這樣有效？
   1. 分層部署: ODL 作為「大腦」跑在獨立容器，Mininet 作為「肌肉」跑在特權容器。
   2. SDN Adapter: 您的 Adapter 會定期向 ODL 請求拓樸資訊。當 Mininet 把 Switch/Host 註冊給 ODL 時，Adapter 會捕捉到這些
      OpenFlow 節點，轉換為 nodes JSON，再交給前端 React Three Fiber 渲染。


---

## 授權條款

請依實際需求選擇授權條款（例如 MIT、Apache-2.0、專案私有等），並同步更新 `LICENSE` 檔案。

