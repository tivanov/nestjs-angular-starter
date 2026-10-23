import { bootstrapServer } from './bootstrap/bootstrap-server.js';
import { runCluster } from './bootstrap/run-cluster.js';

runCluster(bootstrapServer);
