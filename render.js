/**
 * Created by A ciTy on 2020/11/22.
 * Description:渲染到页面上的相关逻辑
 */

class Renderer {
    constructor() {
    }

    spliceHtml(){
        throw new Error('This method must be overwritten!');
    }

    getDivInsertAfter(){
        throw new Error('This method must be overwritten!');
    }

    render(){
        $(this.insertHtml).insertAfter(this.divInsertAfter);

    }
}

class StoryRemarkRenderer extends Renderer{
    constructor({storyInfo}) {
        super();

        this.storyInfo = storyInfo;
        this.divInsertAfter = this.getDivInsertAfter();
        this.remarkList = this.getRemarList(this.storyInfo);
        this.insertHtml = this.getInsertHtml(this.remarkList);
    }

    getDivInsertAfter(){
        // 验收标准的div
        return $('.row-table .col-main .main fieldset').eq(2);
    }

    getRemarList(storyInfo){
        // 只过滤出手动添加的备注
        const remarkList = Object.keys(storyInfo.actions).map(actionKey => storyInfo.actions[actionKey]).filter(item => item.action === 'commented');
        console.log(remarkList);

        return remarkList;
    }

    getInsertHtml(remarkList){
        return `<fieldset class="fozContainer">
            <legend>需求备注（Powered by FOZ）</legend>
            <ol>${remarkList.map(item =>'<li><span class="item">' + item.date + ', 由 <strong>'+ this.storyInfo.users[item.actor] + '</strong> 添加备注。</span><div class="article-content comment967188">' + item.comment + '</div></li>')}</ol>
        </fieldset>`
    }
}


function renderStoryRemark(storyInfo){
    if(!storyInfo || !storyInfo.actions){
        console.warn('renderStoryRemark error', storyInfo);

        return;
    }

    let storyRemarkRenderer = new StoryRemarkRenderer({storyInfo});

    storyRemarkRenderer.render();
}
