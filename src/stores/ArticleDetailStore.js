import {
  action, observable, configure, runInAction,
} from 'mobx';
import { message } from 'antd/lib/index';
import Editor from 'tui-editor';
import { articleApi } from '../http/index';

configure({
  strict: 'always',
});

class ArticleDetailStore {
  @observable headerCover;

  @observable title;

  @observable summary;

  @observable content;

  @observable tags;

  @observable lastModifiedDate;

  @observable uploadStatus;

  @observable editorImage;

  @observable editorImageName;

  @observable loading;

  @observable editorInstance;

  constructor() {
    this.articleApi = articleApi;
    this.headerCover = '';
    this.title = '';
    this.summary = '';
    this.content = '';
    this.tags = [];
    this.lastModifiedDate = '';
    this.uploadStatus = false;
    this.editorImage = '';
    this.editorImageName = '';
    this.loading = false;
    this.editorInstance = {};
  }

  initEditor = () => {
    const editor = new Editor({
      el: document.querySelector('#editSection'),
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      height: '800px',
      hideModeSwitch: true,
      exts: ['scrollSync'],
      toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'indent',
        'outdent',
        'divider',
        'table',
        'link',
        'divider',
        'code',
        'codeblock',
        'divider',
      ],
    });

    const toolbar = editor.getUI().getToolbar();
    toolbar.addButton({
      name: 'upload',
      className: 'tui-image',
      event: 'upload',
      tooltip: 'Upload Images',
    }, -1);

    this.editorInstance = editor;
  };

  @action onHeaderCoverChange = (e) => {
    this.headerCover = e.target.value;
  };

  @action onTitleChange = (e) => {
    this.title = e.target.value;
  };

  @action onSummaryChange = (e) => {
    this.summary = e.target.value;
  };

  @action onContentChange = (e) => {
    this.content = e.target.value;
  };

  @action onTagsChange = (e) => {
    this.tags = e.target.value;
  };

  @action onLastModifiedDateChange = (e) => {
    this.lastModifiedDate = e.target.value;
  };

  @action onHeaderCoverUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.uploadStatus = true;
      return;
    }
    if (info.file.status === 'done') {
      this.uploadStatus = false;
      this.headerCover = info.file.response.path;
    }
  };

  @action onContentImageUploadChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      this.loading = true;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.editorImageName = info.file.name;
      this.editorImage = info.file.response.path;
      this.loading = false;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.loading = false;
    }
  };
}

const articleDetailStore = new ArticleDetailStore(articleApi);

export default articleDetailStore;