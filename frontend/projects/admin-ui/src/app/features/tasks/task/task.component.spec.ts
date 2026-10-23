import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { TaskDto, TaskTypeEnum } from '@app/contracts';
import { of } from 'rxjs';
import { TasksService } from '../../../../../../common-ui/services/tasks.service';
import { TaskComponent } from './task.component';

describe('TaskComponent request payloads', () => {
  let component: TaskComponent;
  let tasks: jasmine.SpyObj<TasksService>;

  beforeEach(() => {
    tasks = jasmine.createSpyObj('TasksService', ['getOne', 'create', 'update']);
    tasks.create.and.returnValue(of({} as TaskDto));
    tasks.update.and.returnValue(of({} as TaskDto));
    TestBed.configureTestingModule({
      providers: [provideRouter([]),
        { provide: TasksService, useValue: tasks },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }],
    });
    component = TestBed.runInInjectionContext(() => new TaskComponent());
    component.ngOnInit();
    spyOn(component['router'], 'navigate').and.resolveTo(true);
    component.form.patchValue({ type: TaskTypeEnum.RunScript, name: 'Example' });
  });

  afterEach(() => component.ngOnDestroy());

  it('creates without an ID after a form reset', () => {
    component.reset();
    component.form.patchValue({ type: TaskTypeEnum.RunScript, name: 'Example' });
    component.onSubmit();
    expect(tasks.create).toHaveBeenCalled();
    expect('id' in tasks.create.calls.mostRecent().args[0]).toBeFalse();
    expect(tasks.update).not.toHaveBeenCalled();
  });

  it('loads and resets an entity and updates using its ID in the URL', () => {
    const task = { id: 'task-id', name: 'Original', type: TaskTypeEnum.RunScript } as TaskDto;
    tasks.getOne.and.returnValue(of(task));
    component.load(task.id);
    expect(component.entity).toEqual(task);
    expect(component.dataLoaded()).toBeTrue();
    component.form.patchValue({ name: 'Changed' });
    component.reset();
    expect(component.form.value.name).toBe('Original');
    component.onSubmit();
    const [id, command] = tasks.update.calls.mostRecent().args;
    expect(id).toBe(task.id);
    expect('id' in command).toBeFalse();
    expect('type' in command).toBeFalse();
    expect(tasks.create).not.toHaveBeenCalled();
  });

  it('does not submit an invalid form', () => {
    component.form.patchValue({ name: null });
    component.onSubmit();
    expect(tasks.create).not.toHaveBeenCalled();
    expect(tasks.update).not.toHaveBeenCalled();
  });
});
