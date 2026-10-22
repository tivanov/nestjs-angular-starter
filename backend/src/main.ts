import { bootstrapServer } from './bootstrap/bootstrap-server';
import { runCluster } from './bootstrap/run-cluster';

runCluster(bootstrapServer);
