import { ModuleRef } from '@nestjs/core';
import { Task } from './../model/task.model';
import { Logger } from '@nestjs/common';
import * as vm from 'vm';
import { TaskLogsService } from '../services/task-logs.service';

export class RunScriptTask {
  private static readonly logger = new Logger(RunScriptTask.name);
  private static isRunning = false;

  public static async run(task: Task, moduleRef: ModuleRef) {
    const log = moduleRef.get(TaskLogsService, { strict: false });

    if (RunScriptTask.isRunning) {
      log
        .debug(task.type, `Task ${task.name} is already running`)
        .then(() => null);
      return;
    }

    RunScriptTask.isRunning = true;
    try {
      log.debug(task.type, `Running task ${task.name}`).then(() => null);

      const sandbox = { task, logger: console };
      const context = vm.createContext(sandbox);
      const script = new vm.Script(task.script);
      script.runInContext(context);
    } finally {
      RunScriptTask.isRunning = false;
    }
  }
}
