import express from "express";
import axios from "axios";
import cors from "cors";
import { transformOdlToTopology } from "./odl-transformer";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const ODL_BASE_URL = process.env.ODL_URL || "http://localhost:8181";
const ODL_AUTH = {
  username: "admin",
  password: "admin"
};

// Mock ODL response for when ODL is not reachable
const MOCK_ODL_TOPOLOGY = {
  "network-topology": {
    "topology": [{
      "topology-id": "flow:1",
      "node": [
        { "node-id": "openflow:1", "termination-point": [{ "tp-id": "1" }, { "tp-id": "2" }] },
        { "node-id": "openflow:2", "termination-point": [{ "tp-id": "1" }] },
        { "node-id": "host:1", "termination-point": [{ "tp-id": "1" }] }
      ],
      "link": [
        { "link-id": "link-1", "source": { "source-node": "openflow:1", "source-tp": "1" }, "destination": { "dest-node": "openflow:2", "dest-tp": "1" } },
        { "link-id": "link-2", "source": { "source-node": "openflow:2", "source-tp": "1" }, "destination": { "dest-node": "host:1", "dest-tp": "1" } }
      ]
    }]
  }
};

app.get("/api/v1/topology/sdn", async (req, res) => {
  try {
    const response = await axios.get(
      `${ODL_BASE_URL}/restconf/operational/network-topology:network-topology`,
      {
        auth: ODL_AUTH,
        headers: { Accept: "application/json" }
      }
    );
    const topology = transformOdlToTopology(response.data);
    res.json(topology);
  } catch (error: any) {
    console.warn("Could not reach ODL, returning mock data. Error:", error.message);
    // Return mock data for POC demonstration
    const topology = transformOdlToTopology(MOCK_ODL_TOPOLOGY as any);
    res.json(topology);
  }
});

app.listen(port, () => {
  console.log(`SDN Adapter backend listening at http://localhost:${port}`);
});
