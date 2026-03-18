# 3D Network Infra Topology

本專案是一個基於 **React Three Fiber (3D)**、**Rust (Axum)** 與 **SDN (Ryu)** 的網路拓樸視覺化系統。它能同時展示「實體網路層 (Physical)」、「虛擬網路層 (Virtual)」與「服務應用層 (Service)」，協助工程師直觀地理解複雜的基礎設施關聯。

---

## 核心技術棧

- **前端 (Web)**: React, Three.js, React Three Fiber, Vite, TypeScript.
- **後端 (SDN Adapter)**: Rust, Axum, Tokio, Reqwest (高效能 Ryu 資料轉換器).
- **SDN 控制器**: Ryu - 負責 OpenFlow 拓樸管理與狀態收集.
- **網路模擬**: Mininet - 用於模擬實體 Switch、Host 與 Link.
- **部署**: Docker Compose (在地開發), Render (雲端部署).

---

## 專案結構

- `web/`: React 3D 前端視覺化介面。
- `backend/`: Rust 實作的 SDN Adapter，對接 Ryu REST API 並轉換格式。
- `mininet/`: Mininet 模擬環境的 Docker 配置。
- `docker-compose.yml`: 一鍵啟動完整的 SDN + 3D 展示環境。
- `render.yaml`: Render 雲端部署藍圖（支援新加坡區域與免費方案）。

---

## 啟動與測試 (本地 Docker 環境)

本流程將在您的電腦上啟動一個包含真實 SDN 控制器的模擬網路環境。

### A. 啟動所有容器服務
這會啟動 Ryu、Rust Adapter、Mininet 容器以及前端介面。
```bash
docker-compose up -d --build
```
> **注意**：Ryu 初次建置時需要安裝 Python 相依套件，可能需要 1-2 分鐘。您可以透過 `docker logs -f ryu_controller` 查看進度。
> **注意**：Mininet 容器啟動時會自動初始化 Open vSwitch。若您在 Docker Desktop 上執行，建議先用較小的拓樸驗證流程。

### B. 進入 Mininet 建立模擬拓樸
當 Ryu 啟動完成後（`docker ps` 顯示健康狀態），進入 Mininet 容器手動建立網路：
```bash
docker exec -it mininet_network bash
```
在容器內部執行 Mininet 命令：
```bash
# 建立一個包含 1 個 Switch、3 個 Host 的星型拓樸，並連向 Ryu 控制器
mn --controller=remote,ip=ryu,port=6633 --topo=single,3
```
進入 Mininet CLI 後，執行 `pingall` 確保網路連通：
```bash
mininet> pingall
```

若要建立樹狀拓樸，先從較小的規模開始，例如：
```bash
mn --controller=remote,ip=ryu,port=6633 --topo=tree,depth=3,fanout=3
```

### C. 驗證 3D 視覺化
1. **訪問前端**：打開瀏覽器訪問 `http://localhost:5173`。
2. **檢視實體層**：
   - 您會看到 3D 場景的最底層（Y < 0）出現了 **1 個長方形 Switch** 與 **3 個立方體 Host**。
   - 點擊節點可查看來自 Ryu 的實體資訊（如 OpenFlow ID、連接埠數量等）。
3. **檢視動態風險**：
   - 系統會模擬即時監控，當網路負載高時，Switch 顏色會轉為橘色或紅色。

---

## 本地開發 (無 Docker 模式)

如果您只想修改前端或後端程式碼，不啟動 Ryu：

### 1. 啟動 Rust 後端 (Adapter)
後端在無法連接 Ryu 時會自動切換至 **Mock 模式**。
```bash
cd backend
cargo run
```
服務將運行在 `http://localhost:4000`。

### 2. 啟動前端 (Web)
```bash
cd web
npm install
npm run dev
```
訪問 `http://localhost:5173`，您將看到預設的服務層拓樸與 Mock 的 SDN 節點。

---

## 雲端部署 (Render)

本專案支援一鍵部署至 **Render**。

1. 將本專案推送到您的 GitHub。z
2. 在 Render 控制台選擇 **"Blueprints"**。
3. 連結此 Repository，Render 會自動讀取 `render.yaml` 並：
   - 在 **Singapore** 區域建立 Rust Web Service (後端)。
   - 在 **Singapore** 區域建立 Static Site (前端)。
   - 自動將後端網址注入給前端。

---

## 視覺化層級說明 (Realm & Layer)

在 3D 場景中，節點按高度分布：
- **Service Layer (頂層, Y > 0)**: 顯示 API Gateway, Rule Engine, DB 等應用程式服務。
- **Virtual Layer (中層, Y ≈ 0)**: 顯示 OVS (Open vSwitch) 或虛擬連接。
- **Physical Layer (底層, Y < 0)**: 顯示由 Ryu 發現的實體 Switch 與 Host。

---

## 授權條款
MIT License
