import * as echarts from '../../components/ec-canvas/echarts'

var initChart = null;

Page({
  data: {
    loadContent: "正在分析中...",
    ec: {
      onInit: function (canvas, width, height) {
        initChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart);
        return initChart;
      }
    },
    //统计的数据
    statistics: {
      completed: 0,
      abandoned: 0,
      running: 0
    },
    evaluations: {
      more: {
        evaluation: "目标数量过多，应量力而行",
        suggestion: "目标太多就会失去重心，迷失奋斗和追求的方向，扰乱自己奋斗和努力的主攻计划，增加实现目标难度，因此目标太多弊大于利，是不可取的。",
        show: false
      },
      fail: {
        evaluation: "失败目标数量过多，应明确目标的意义",
        suggestion: `你为什么要设定这个目标？达到这个计划的目标对你意味着什么？当你达到目标后你会有什么感觉？如果你对这些问题都还不是很清楚，说明你还不是特别急切地希望达到这些目标。一个明确的目标，即使面对艰难和挑战，你仍然急切地想要竭尽所能来达到它。所以，你需要十分透彻地明白你制定的目标对你的意义。否则，你只会很容易忘记它，并且很难会有进展。`,
        show: false
      },
      success: {
        evaluation: "目标基本达成，望继续坚持",
        suggestion: "坚信自我，坚信自我的目标，去承受常人承受不了的磨难与挫折，不断去发奋去奋斗，成功最终就会是你的！",
        show: false
      },
      less: {
        evaluation: "目标数量太少，应及时制定目标",
        suggestion: "目标对人生有着巨大的导向性作用。成功在一开始，仅仅就是一个选择。你选择什么样的目标，就会有什么样的成就，有什么样的人生。",
        show: false
      },
      average: {
        evaluation: "多数目标正在执行，望继续努力实现目标",
        suggestion: "不要沮丧,不必惊慌,做努力爬的蜗牛或坚持飞的笨鸟,我们试着长大,一路跌跌撞撞,然后遍体鳞伤。坚持着,总有一天,你会站在最亮的地方,活成自己曾经渴望的模样。",
        show: false
      }
    }
  },
  backHome: function () {
    wx.navigateBack({});
  },
  getTargets: function () {
    //获取用户目标
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('target').where({})
      .orderBy("time", "desc")
      .get()
      .then(res => {
        //统计各类树的总量
        that.getStatistics(res.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setData({
          loadContent: ""
        });
      })
  },
  getStatistics: function (targets) {
    //统计完成还有枯萎的树木的总量
    let completed = 0;
    let abandoned = 0;
    let running = 0;

    for (let i = 0; i < targets.length; i++) {
      if (targets[i].status == -1) {
        abandoned += 1;
      }
      if (targets[i].status == 1) {
        completed += 1;
      }
      if (targets[i].status == 0) {
        running += 1;
      }
    }
    this.setData({
      statistics: {
        completed: completed,
        abandoned: abandoned,
        running: running
      }
    });
    this.analysis(this.data.statistics);
    this.initChartOptions(this.data.statistics);
  },
  analysis: function (statistics) {
    let evaluations = this.data.evaluations;
    let sum = statistics.completed + statistics.abandoned + statistics.running;
    if (statistics.running > 3) {
      //进行中的目标过多
      evaluations.more.show = true;
    }
    if (statistics.running < 2) {
      evaluations.less.show = true;
    }
    let fail = sum==0?0:statistics.abandoned/sum;
    if (fail>0.3) {
      //失败比率超过30%
      evaluations.fail.show = true;
    }
    if (statistics.abandoned == 0 && statistics.completed != 0) {
      evaluations.success.show = true;
    }
    if (statistics.running > 0 && statistics.fail == 0) {
      evaluations.average.show = true;
    }

    this.setData({
      evaluations: evaluations
    });
  },
  initChartOptions: function (statistics) {
    initChart.setOption({
      backgroundColor: "#ffffff",
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: [{
          value: statistics.abandoned,
          name: '已失败'
        }, {
          value: statistics.completed,
          name: '已完成'
        }, {
          value: statistics.running,
          name: '进行中'
        }]
      }]
    });
  },
  onReady: function () {
    this.getTargets();
  }
});