import { Logger } from '@nestjs/common';
import * as cluster from 'cluster';
import * as os from 'os';

// Preserve environment-based sizing and worker numbers across restarts.
export function runCluster(startWorker: () => Promise<void>) {
  let numCPUs = os.cpus().length;

  if (process.env.NODE_ENV === 'development') {
    numCPUs = 2;
  }

  if (cluster.isPrimary) {
    Logger.log(`Master server started on ${process.pid}`);
    const workerNumbers = new Map<number, number>();

    const forkWorker = (workerNumber: number) => {
      const worker = cluster.fork({
        WORKER_NUMBER: workerNumber,
      });
      workerNumbers.set(worker.id, workerNumber);
    };

    for (let i = 0; i < numCPUs; i++) {
      forkWorker(i);
    }

    cluster.on('exit', (worker) => {
      const workerNumber = workerNumbers.get(worker.id);
      workerNumbers.delete(worker.id);

      if (workerNumber === undefined) {
        Logger.error(
          `Worker ${worker.process.pid} died with unknown WORKER_NUMBER. Not restarting.`,
        );
        return;
      }

      Logger.log(
        `Worker ${worker.process.pid} (WORKER_NUMBER=${workerNumber}) died. Restarting`,
      );
      forkWorker(workerNumber);
    });
  } else {
    Logger.log(`Cluster server started on ${process.pid}`);
    startWorker();
  }
}
