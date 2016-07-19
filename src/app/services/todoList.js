import cuid from 'cuid';
//import 'core-js/modules/es6.array.find';
import moment from 'moment';
export default class TodoList {

  constructor() {
    this.filterState = 'all';
    this.filteredList = this.list = [];
  }

  add(description) {
    const task = new Task(description);
    this.list.push(task);
    this.$refreshList();

    return task;
  }

  toggleAll() {
    const complete = this.countPending() !== 0;
    this.list = this.list.map((task) => {
      task.complete = !!complete;

      return task;
    });

    this.$filter();
  }

  toggleStatus(task) {
    task.complete = !task.complete;
      if (task.complete) {
        task.completedTime = moment().format();
        task.completionLength = moment.duration(moment().diff(task.createTime));
        if (task.completionLength.asHours() < 1) {
          if (task.completionLength.asMinutes() < 1) {
            task.completionAsSeconds = task.completionLength.seconds();
            task.completionSeconds = 'seconds';
          } else {
            task.completionAsMinutes = task.completionLength.minutes();
            task.completionMinutes = 'minutes';
            task.completionAsSeconds = task.completionLength.seconds();
            task.completionSeconds = 'seconds';
          }
        } else {
          task.completionAsHours = task.completionLength.hours();
          task.completionHours = 'hours';
          task.completionAsMinutes = task.completionLength.minutes();
          task.completionMinutes = 'minutes';
          task.completionAsSeconds = task.completionLength.seconds();
          task.completionSeconds = 'seconds';
        }
      } else {
        task.completedTime = '';
        task.completionLength = '';
      }
    this.$filter();
  }

  remove(item) {
    this.list = this.list.filter((todo) => todo !== item);
    this.$filter();
  }

  clearCompleted() {
    this.list = this.list.filter((todo) => !todo.complete);
    this.$filter();
  }

  showCompleted() {
    this.filterState = 'completed';
    this.$filter();
  }

  showActive() {
    this.filterState = 'active';
    this.$filter();
  }

  showAll() {
    this.filterState = 'all';
    this.$filter();
  }

  $filter(filterState = this.filterState) {
    this.filterState = filterState;
    const showAll = ('all' === filterState);
    const showCompleted = 'completed' === filterState;

    this.filteredList = this.list.filter((item) => (showAll || showCompleted === item.complete));
  }

  countPending() {
    return this.list.filter((item) => !item.complete).length;
  }

  countCompleted() {
    return this.list.filter((item) => item.complete).length;
  }

  hasTasks() {
    return 0 !== this.list.length;
  }

  $refreshList() {
    this.$filter();
  }

}

class Task {
  constructor(description) {
    this.id = cuid();
    this.description = description;
    this.createTime = moment().format();
    this.isCompleted = false;
    this.completedTime = '';
    this.completionLength = '';
  }

  get complete() {
    return this.isCompleted;
  }

  set complete(val) {
    this.isCompleted = !!val;
  }
}
