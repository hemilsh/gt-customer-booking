export class responseView{
        public list: any = [];
        public view: any = {};
        public code: number = null;
        public records: number = null;
        constructor(view: any = {}) {
          this.list = view.list;
          this.view = view.view;
          this.code = view.code;
          this.records = view.records;
        }
}