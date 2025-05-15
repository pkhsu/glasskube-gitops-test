const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const customMessage = process.env.CUSTOM_MESSAGE || "Message from: Code (if no env var is set)";

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route for the root
app.get('/', (req, res) => {
  res.send(customMessage);
});

// Simulate initiating a distribution task
// In a real scenario, this would trigger Glasskube Distr or similar logic
app.post('/distribute', (req, res) => {
  const { packageName, targetCluster, version } = req.body;

  if (!packageName || !targetCluster) {
    return res.status(400).json({ error: 'packageName and targetCluster are required' });
  }

  console.log(`Simulating distribution request:`);
  console.log(`  Package: ${packageName}`);
  console.log(`  Version: ${version || 'latest'}`);
  console.log(`  Target Cluster: ${targetCluster}`);

  // Simulate asynchronous distribution process
  setTimeout(() => {
    console.log(`Distribution simulation complete for ${packageName} to ${targetCluster}`);
  }, 1500);

  res.status(202).json({
    message: 'Distribution request received and simulation started.',
    details: {
      packageName,
      version: version || 'latest',
      targetCluster,
    }
  });
});

app.listen(port, () => {
  console.log(`EAP Distribution Simulator listening on port ${port}`);
});
