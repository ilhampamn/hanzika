(function(){
  window.HSK_EXERCISE_PATTERNS={
    'hsk2-11':[
      {
        id:'comparison-size',skill:'grammar',type:'choice',difficulty:2,
        prompt:'Which sentence correctly expresses the comparison?',
        options:['{{a}}比{{b}}{{adjective}}{{difference}}。','{{a}}比{{adjective}}{{b}}{{difference}}。','{{a}}{{adjective}}比{{b}}{{difference}}。','{{a}}比{{b}}{{difference}}{{adjective}}。'],
        answer:'{{a}}比{{b}}{{adjective}}{{difference}}。',
        explanation:'Keep the structure A + 比 + B + adjective + difference.',
        cases:[
          {a:'苹果',b:'西瓜',adjective:'便宜',difference:'一些'},
          {a:'姐姐',b:'妹妹',adjective:'大',difference:'两岁'},
          {a:'右边的男孩子',b:'左边的男孩子',adjective:'高',difference:'一点儿'},
          {a:'今年',b:'去年',adjective:'忙',difference:'得多'}
        ]
      }
    ],
    'hsk2-12':[
      {
        id:'degree-complement',skill:'grammar',type:'choice',difficulty:2,
        prompt:'Choose the sentence with the correct degree-complement structure.',
        options:['{{subject}}{{object}}{{verb}}得{{degree}}。','{{subject}}{{verb}}得{{object}}{{degree}}。','{{subject}}{{object}}得{{verb}}{{degree}}。','{{subject}}{{verb}}{{object}}得{{degree}}。'],
        answer:'{{subject}}{{object}}{{verb}}得{{degree}}。',
        explanation:'With an object, use subject + object + verb + 得 + degree.',
        cases:[
          {subject:'他',object:'汉语',verb:'说',degree:'很好'},
          {subject:'她',object:'汉字',verb:'写',degree:'很漂亮'},
          {subject:'我弟弟',object:'饭',verb:'做',degree:'不怎么样'},
          {subject:'我妻子',object:'歌',verb:'唱',degree:'很好'}
        ]
      }
    ],
    'hsk2-13':[
      {
        id:'continuing-state',skill:'grammar',type:'choice',difficulty:2,
        prompt:'Which sentence correctly describes a continuing state with 着?',
        options:['{{subject}}{{location}}{{verb}}着{{object}}。','{{subject}}{{location}}着{{verb}}{{object}}。','{{subject}}着{{location}}{{verb}}{{object}}。','{{subject}}{{location}}{{verb}}{{object}}着。'],
        answer:'{{subject}}{{location}}{{verb}}着{{object}}。',
        explanation:'Put 着 directly after the verb that describes the continuing state.',
        cases:[
          {subject:'女孩儿',location:'手里',verb:'拿',object:'铅笔'},
          {subject:'老师',location:'教室里',verb:'站',object:'呢'},
          {subject:'孩子',location:'房间里',verb:'坐',object:'呢'},
          {subject:'杨笑笑',location:'门口',verb:'等',object:'呢'}
        ]
      }
    ],
    'hsk2-14':[
      {
        id:'past-experience',skill:'grammar',type:'choice',difficulty:2,
        prompt:'Which sentence correctly uses 过 for past experience?',
        options:['{{subject}}{{negative}}{{verb}}过{{object}}。','{{subject}}{{negative}}过{{verb}}{{object}}。','{{subject}}{{verb}}{{object}}过。','{{subject}}过{{negative}}{{verb}}{{object}}。'],
        answer:'{{subject}}{{negative}}{{verb}}过{{object}}。',
        explanation:'Use 没(有) before the verb when needed and place 过 directly after the verb.',
        cases:[
          {subject:'我',negative:'',verb:'去',object:'中国'},
          {subject:'她',negative:'没',verb:'看',object:'那个电影'},
          {subject:'我们',negative:'',verb:'吃',object:'北京菜'},
          {subject:'弟弟',negative:'没有',verb:'坐',object:'火车'}
        ]
      }
    ],
    'hsk2-15':[
      {
        id:'scheduled-imminent',skill:'grammar',type:'choice',difficulty:3,
        prompt:'A specific time is stated. Which sentence uses 就要……了 correctly?',
        options:['{{time}}{{subject}}就要{{action}}了。','{{time}}{{subject}}快要{{action}}了。','{{subject}}就{{time}}要{{action}}了。','{{time}}就要{{subject}}了{{action}}。'],
        answer:'{{time}}{{subject}}就要{{action}}了。',
        explanation:'With a specific time phrase, this chapter uses time + subject + 就要 + action + 了.',
        cases:[
          {time:'明天',subject:'我',action:'去火车站买票'},
          {time:'下个月',subject:'妹妹',action:'去北京旅游'},
          {time:'八点',subject:'火车',action:'到'},
          {time:'十二月三十一日',subject:'新年',action:'到'}
        ]
      }
    ]
  };
})();
