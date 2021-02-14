/**
 * Created by A ciTy on 2020/11/22.
 * Description:渲染到页面上的相关逻辑
 */

class Renderer {
    constructor() {
    }

    spliceHtml() {
        throw new Error('This method must be overwritten!');
    }

    getDivInsertAfter() {
        throw new Error('This method must be overwritten!');
    }

    render() {
        $(this.insertHtml).insertAfter(this.divInsertAfter);

    }
}

class StoryRemarkRenderer extends Renderer {
    constructor({storyInfo}) {
        super();

        this.storyInfo = storyInfo;
        this.divInsertAfter = this.getDivInsertAfter();
        this.remarkList = this.getRemarkList(this.storyInfo);
        this.insertHtml = this.getInsertHtml(this.remarkList);
    }

    getDivInsertAfter() {
        // 验收标准的div
        return $('.row-table .col-main .main fieldset').eq(2);
    }

    getRemarkList(storyInfo) {
        // 只过滤出手动添加的备注
        const remarkList = Object.keys(storyInfo.actions).map(actionKey => storyInfo.actions[actionKey]).filter(item => item.action === 'commented');
        // console.log(remarkList);

        return remarkList;
    }

    getInsertHtml(remarkList) {

        // join是为了去除逗号
        return `<fieldset class="fozContainer">
            <legend>需求备注（Powered by FOZ）</legend>
            <ol>${remarkList.map(item => '<li><span class="item">' + item.date + ', 由 <strong>' + this.storyInfo.users[item.actor] + '</strong> 添加备注。</span><div class="article-content comment967188">' + item.comment + '</div></li>').join('')}</ol>
        </fieldset>`

    }
}

function renderStoryRemark(storyInfo) {
    if (!storyInfo || !storyInfo.actions) {
        console.warn('renderStoryRemark error', storyInfo);

        return;
    }

    let storyRemarkRenderer = new StoryRemarkRenderer({storyInfo});

    storyRemarkRenderer.render();
}

class TaskListOfStoryRender extends Renderer {
    constructor({storyInfo, taskInfo}) {
        super();

        this.storyInfo = storyInfo;
        this.currentTaskInfo = taskInfo;
        this.divInsertAfter = this.getDivInsertAfter();
        this.taskList = this.getTaskList(this.storyInfo);
        this.insertHtml = this.getInsertHtml(this.taskList);

    }

    getDivInsertAfter() {
        // 验收标准的div
        return $('.row-table .col-main .main fieldset').eq(3);
    }

    getTaskList(storyInfo) {

        let taskList = [];

        for (let projectId in storyInfo.story.tasks) {
            taskList = taskList.concat(storyInfo.story.tasks[projectId]);
        }

        /*await Promise.all(taskList.map(async task => {

            const taskUrl = `http://ztpm.goldwind.com.cn:9898/pro/story-view-${task.id}.json`;

            const taskInfo = await fetchInfo(taskUrl);

        }));*/

        taskList = taskList.filter(item => item.id !== this.currentTaskInfo.task.id);

        taskList.sort((a, b) => Number(b.id) - Number(a.id));

        // console.log(taskList);

        return taskList;
    }

    getInsertHtml(taskList) {

        const getTaskHref = id => `http://ztpm.goldwind.com.cn:9898/pro/task-view-${id}.html`;
        const statusMap = {
            doing: {
                text: '进行中',
                color: '#d2322d'
            },
            done: {
                text: '已完成',
                color: '#229f24'
            },
            closed: {
                text: '已关闭',
                color: '#888'
            },
            cancel: {
                text: '已取消',
                color: '#888'
            },
            pause: {
                text: '已暂停',
                color: '#888'
            },
            wait: {
                text: '未开始',
                color: '#888'
            }
        };

        let users = this.storyInfo.users;

        // join是为了去除逗号
        return `<fieldset class="fozContainer">
            <legend>同需求的任务（Powered by FOZ）</legend>
            <ol>${taskList.map(item => '<li><span style="color:' + (statusMap[item.status] ? statusMap[item.status].color : '#000') + '">' + (statusMap[item.status] ? statusMap[item.status].text : item.status) + ' &nbsp;&nbsp;</span><a target="_blank" href="' + getTaskHref(item.id) + '">#' + item.id + ' ' + item.name + ' 【' + users[item.assignedTo] + '】</a></li>').join('')}</ol>
        </fieldset>`

    }
}

function renderTaskListOfStory(storyInfo, taskInfo) {
    if (!storyInfo || !storyInfo.actions) {
        console.warn('renderTaskListOfStory error', storyInfo);

        return;
    }

    let taskListOfStoryRenderer = new TaskListOfStoryRender({storyInfo, taskInfo});

    taskListOfStoryRenderer.render();
}

class CreateTaskBtnRender extends Renderer {
    constructor({storyInfo}) {
        super();

        this.storyInfo = storyInfo;
        this.divInsertAfter = this.getDivInsertAfter();
        this.insertHtml = this.getInsertHtml(this.storyInfo);
    }

    getDivInsertAfter() {
        // 验收标准的div
        return $('#titlebar .actions .btn-group').eq(0);
    }

    getInsertHtml(storyInfo) {

        const projects = storyInfo.projects;

        if (!projects || !(projects instanceof Object)) {
            console.warn('CreateTaskBtnRender error in getInsertHtml', storyInfo);
        }

        const projectID = Object.keys(projects)[0];

        // join是为了去除逗号
        return `<a style='position: relative;' href='/pro/task-create-${projectID}-${storyInfo.id}-0.html' class='btn btn-primary'><i class='icon icon-plus'></i>建任务<span style='display:inline-block;position: absolute;transform: scale(0.6);bottom:-7px;left:-23px'>（Powered by FOZ）</span></a>`

    }

    render() {
        $(this.insertHtml).insertAfter(this.divInsertAfter);
    }
}

function renderCreateTaskBtn(storyInfo) {
    if (!storyInfo) {
        console.warn('renderCreateTaskBtn error', storyInfo);

        return;
    }

    let createTaskBtnRenderer = new CreateTaskBtnRender({storyInfo});

    createTaskBtnRenderer.render();
}

class BugResolveTimeRender extends Renderer {
    constructor({bugInfo, resolveBugTaskList}) {
        super();

        this.bugInfo = bugInfo;
        this.resolveBugTaskList =resolveBugTaskList;
        this.divInsertAfter = this.getDivInsertAfter();
        this.insertHtml = this.getInsertHtml(this.resolveBugTaskList);
    }

    getDivInsertAfter() {
        // 验收标准的div
        return $('.form-condensed tbody tr').eq($('.form-condensed tbody tr').length - 2);
    }

    getInsertHtml(resolveBugTaskList) {

        // join是为了去除逗号
        return `<tr>
      <th class="w-100px">工时</th>
      <td class="w-p45-f">启用：<input value="recordResolveBugTime" type="checkbox"/><div style="display: inline-block;padding-left: 10px">消缺任务：</div><select name="resolution" id="resolution" class="form-control" onchange="setDuplicate(this.value)" style="display: inline-block;width:calc(100% - 120px)">${resolveBugTaskList.map(item => '<option value="' + item.id + '">' + item.name + '</option>').join('')}</select></td>
      <td style="padding-left: 15px;"><div style="display: inline-block">工时（小时）：</div><input class="form-control" type="number" min="1" step="1" style="display: inline-block;width: calc(100% - 100px)"></td>
    </tr>`

    }

    render() {
        $(this.insertHtml).insertAfter(this.divInsertAfter);
    }
}

function renderBugResolveTime(bugInfo, resolveBugTaskList) {
    if (!bugInfo || !resolveBugTaskList) {
        console.warn('renderCreateTaskBtn error', bugInfo);

        return;
    }

    let bugResolveTimeRender = new BugResolveTimeRender({bugInfo, resolveBugTaskList});

    bugResolveTimeRender.render();
}
