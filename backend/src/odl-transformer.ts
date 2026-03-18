export interface OdlNode {
  "node-id": string;
  "termination-point"?: Array<{ "tp-id": string }>;
}

export interface OdlLink {
  "link-id": string;
  "source": { "source-node": string; "source-tp": string };
  "destination": { "dest-node": string; "dest-tp": string };
}

export interface OdlTopology {
  "network-topology": {
    "topology": Array<{
      "topology-id": string;
      "node": OdlNode[];
      "link": OdlLink[];
    }>;
  };
}

export function transformOdlToTopology(odlData: OdlTopology) {
  const nodes: any[] = [];
  const links: any[] = [];
  
  const topology = odlData["network-topology"].topology[0];
  
  if (topology) {
    // Transform Nodes
    topology.node.forEach((node, index) => {
      const isSwitch = node["node-id"].startsWith("openflow:");
      nodes.push({
        id: node["node-id"],
        name: isSwitch ? `Switch ${node["node-id"].split(":")[1]}` : node["node-id"],
        type: isSwitch ? "switch" : "host",
        realm: "physical",
        layer: isSwitch ? 1 : 2,
        status: "healthy",
        // Simple circle layout for POC
        position: {
          x: Math.cos(index) * 10,
          y: -10, // Physical layer offset
          z: Math.sin(index) * 10
        },
        riskScore: Math.random() * 0.3, // Mock risk from stats
        metadata: {
          ports: node["termination-point"]?.length || 0
        }
      });
    });

    // Transform Links
    topology.link.forEach(link => {
      links.push({
        id: link["link-id"],
        from: link.source["source-node"],
        to: link.destination["dest-node"],
        kind: "physical",
        realm: "physical"
      });
    });
  }

  return { nodes, links };
}
