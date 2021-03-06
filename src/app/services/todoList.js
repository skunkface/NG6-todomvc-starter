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
      task.readLength();

      return task;
    });

    this.$filter();
  }

  toggleStatus(task) {
    task.complete = !task.complete;
    task.readLength();
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

  readLength() {
    this.completedTime = moment().format();
    this.completionLength = moment.duration(moment().diff(this.createTime));
    if (this.completionLength.asHours() < 1) {
      if (this.completionLength.asMinutes() < 1) {
        this.completionAsSeconds = this.completionLength.seconds();
        this.completionSeconds = 'seconds';
      } else {
        this.completionAsMinutes = this.completionLength.minutes();
        this.completionMinutes = 'minutes';
        this.completionAsSeconds = this.completionLength.seconds();
        this.completionSeconds = 'seconds';
      }
    } else {
      this.completionAsHours = this.completionLength.hours();
      this.completionHours = 'hours';
      this.completionAsMinutes = this.completionLength.minutes();
      this.completionMinutes = 'minutes';
      this.completionAsSeconds = this.completionLength.seconds();
      this.completionSeconds = 'seconds';
    }
  }
}
