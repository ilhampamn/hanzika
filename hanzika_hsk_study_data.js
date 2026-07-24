(function(){
  const curriculum=window.HSK_REVIEW_CURRICULUM;
  if(!curriculum) return;
  const q=(id,skill,type,prompt,config)=>({id,skill,type,prompt,...config});

  const chapters=[
    {
      id:'hsk2-1', number:1, titleZh:'九月去北京旅游最好', titleEn:'September is the best time to visit Beijing',
      sourcePages:'HSK Standard Course 2 · Chapter 1',
      vocabulary:[['旅游','lǚyóu','to travel'],['觉得','juéde','to think; feel'],['最','zuì','most'],['为什么','wèishénme','why'],['运动','yùndòng','exercise'],['一起','yìqǐ','together'],['新','xīn','new'],['也','yě','also']],
      objectives:['Express an opinion with 觉得','Use 最 to form a superlative','Ask for a reason with 为什么','Use 要 for wants and intentions','Invite someone to do an activity together'],
      reading:{title:'九月的北京',sentences:['我觉得九月去北京旅游最好。','天气不冷也不热，很舒服。','我想去看长城，也想吃北京菜。','你为什么想去北京？我们一起去吧！'],pinyin:'Wǒ juéde jiǔyuè qù Běijīng lǚyóu zuì hǎo. Tiānqì bù lěng yě bú rè, hěn shūfu. Wǒ xiǎng qù kàn Chángchéng, yě xiǎng chī Běijīng cài. Nǐ wèishénme xiǎng qù Běijīng? Wǒmen yìqǐ qù ba!',en:'I think September is the best time to visit Beijing. It is neither cold nor hot. I want to see the Great Wall and eat Beijing food. Why do you want to go? Let’s go together!',source:'Adapted chapter reading'},
      summary:['觉得 introduces a personal opinion.','最 + adjective marks the highest degree.','为什么 asks for a reason; answers often use 因为.','也 normally comes before the verb or adjective it adds.'],
      questions:[
        q('1-l-season','listening','choice','When does the speaker recommend visiting Beijing?',{audio:'我觉得九月去北京旅游最好。',options:['March','June','September','December'],answer:'September',explanation:'九月 is September, and 最好 means “best.”',source:'Chapter 1 dialogue'}),
        q('1-l-plan','listening','choice','What does the speaker want to do?',{audio:'下午我想和朋友一起运动。',options:['Study alone','Exercise with a friend','Buy new clothes','Travel tomorrow'],answer:'Exercise with a friend',explanation:'和朋友一起运动 means to exercise together with a friend.',source:'Chapter 1 dialogue'}),
        q('1-v-opinion','vocabulary','choice','Which word introduces “I think…”?',{options:['觉得','一起','运动','为什么'],answer:'觉得',explanation:'我觉得… is the common pattern for giving an opinion.',source:'Chapter 1 vocabulary'}),
        q('1-v-best','vocabulary','choice','Complete “九月去北京___好。”',{options:['也','最','新','一起'],answer:'最',explanation:'最好 means “the best.”',source:'Chapter 1 grammar'}),
        q('1-g-why','grammar','choice','Choose the natural question.',{options:['你为什么学习汉语？','你学习为什么汉语？','为什么你汉语学习？','你学习汉语为什么的？'],answer:'你为什么学习汉语？',explanation:'为什么 normally appears before the verb phrase.',source:'Chapter 1 grammar'}),
        q('1-g-also','grammar','choice','Choose the correct placement of 也.',{options:['我也喜欢运动。','我喜欢也运动。','也我喜欢运动。','我喜欢运动也的。'],answer:'我也喜欢运动。',explanation:'也 comes after the subject and before the verb.',source:'Chapter 1 grammar'}),
        q('1-g-superlative','grammar','choice','Which sentence says this book is the most interesting?',{options:['这本书最有意思。','这本书有意思最。','最这本书有意思。','这本最书有意思。'],answer:'这本书最有意思。',explanation:'Put 最 directly before the adjective phrase.',source:'Chapter 1 grammar'}),
        q('1-g-intention','grammar','choice','Which sentence expresses an intention to travel?',{options:['我要去旅游。','我旅游要的。','我要旅游吗了。','要我去的旅游。'],answer:'我要去旅游。',explanation:'要 + verb can express a want or intention.',source:'Chapter 1 grammar'}),
        q('1-p-order','production','order','Build: “I think Beijing is the best.”',{tokens:['北京','我觉得','最好'],answer:['我觉得','北京','最好'],explanation:'Begin with the opinion frame 我觉得, then the statement.',source:'Chapter 1 practice'}),
        q('1-p-write','production','input','Complete: “你___想学汉语？”',{accepted:['为什么'],answer:'为什么',placeholder:'Type three characters',explanation:'为什么 asks “why.”',source:'Chapter 1 practice'})
      ]
    },
    {
      id:'hsk2-2', number:2, titleZh:'我每天六点起床', titleEn:'I get up at six every day',
      sourcePages:'HSK Standard Course 2 · Chapter 2',
      vocabulary:[['每天','měitiān','every day'],['起床','qǐchuáng','to get up'],['早上','zǎoshang','morning'],['跑步','pǎobù','to jog'],['生病','shēngbìng','to get sick'],['身体','shēntǐ','health; body'],['休息','xiūxi','to rest'],['忙','máng','busy'],['时间','shíjiān','time']],
      objectives:['Describe routines with 每','Ask confirmation with 是不是','Ask degree or quantity with 多','Tell the time of a daily activity','Connect healthy habits and results'],
      reading:{title:'我的一天',sentences:['我每天早上六点起床，六点半去跑步。','我七点吃早饭，八点去上班。','最近工作很忙，但是我每天都运动。','医生说多休息对身体好。'],pinyin:'Wǒ měitiān zǎoshang liù diǎn qǐchuáng, liù diǎn bàn qù pǎobù. Wǒ qī diǎn chī zǎofàn, bā diǎn qù shàngbān. Zuìjìn gōngzuò hěn máng, dànshì wǒ měitiān dōu yùndòng. Yīshēng shuō duō xiūxi duì shēntǐ hǎo.',en:'I get up at six every morning and jog at six thirty. I eat breakfast at seven and go to work at eight. Work is busy, but I exercise every day. The doctor says more rest is good for your health.',source:'Adapted chapter reading'},
      summary:['每 + measure word/noun means every or each.','是不是 turns a statement into a confirmation question.','多 + adjective asks about degree: 多大, 多高, 多远.','Time phrases normally come before the verb.'],
      questions:[
        q('2-l-time','listening','choice','What time does the speaker get up?',{audio:'我每天早上六点起床。',options:['5:00','6:00','7:00','8:00'],answer:'6:00',explanation:'六点 is six o’clock.',source:'Chapter 2 dialogue'}),
        q('2-l-health','listening','choice','What does the doctor recommend?',{audio:'你要多休息，对身体好。',options:['Work more','Rest more','Run faster','Get up earlier'],answer:'Rest more',explanation:'多休息 means “rest more.”',source:'Chapter 2 dialogue'}),
        q('2-v-routine','vocabulary','choice','Which word means “to get up”?',{options:['起床','休息','生病','跑步'],answer:'起床',explanation:'起床 is to get out of bed.',source:'Chapter 2 vocabulary'}),
        q('2-v-busy','vocabulary','choice','Complete “今天工作很多，我很___。”',{options:['忙','高','早上','时间'],answer:'忙',explanation:'忙 means busy.',source:'Chapter 2 vocabulary'}),
        q('2-g-every','grammar','choice','Choose the natural sentence.',{options:['我每天学习汉语。','我每天的学习汉语。','每天我汉语每学习。','我学习每汉语天。'],answer:'我每天学习汉语。',explanation:'每天 functions as a time phrase before the verb.',source:'Chapter 2 grammar'}),
        q('2-g-confirm','grammar','choice','Ask: “Are you a teacher?”',{options:['你是不是老师？','你是老师不是？','是不是你老师的？','你老师是不是的？'],answer:'你是不是老师？',explanation:'是不是 appears before the noun or verb phrase being confirmed.',source:'Chapter 2 grammar'}),
        q('2-g-age','grammar','choice','How do you ask someone’s age with 多?',{options:['你多大？','你大多？','多你大？','你多少大？'],answer:'你多大？',explanation:'多大 asks “how old/how big.”',source:'Chapter 2 grammar'}),
        q('2-g-time-order','grammar','choice','Choose the correct word order.',{options:['我早上六点跑步。','我跑步早上六点。','六点跑步我早上。','我六点早上跑步的。'],answer:'我早上六点跑步。',explanation:'Place the time before the verb phrase.',source:'Chapter 2 grammar'}),
        q('2-p-order','production','order','Build: “I exercise every day.”',{tokens:['运动','我','每天'],answer:['我','每天','运动'],explanation:'Subject + time phrase + verb.',source:'Chapter 2 practice'}),
        q('2-p-write','production','input','Write “every morning” in Chinese.',{accepted:['每天早上'],answer:'每天早上',placeholder:'Type four characters',explanation:'每天早上 means every morning.',source:'Chapter 2 practice'})
      ]
    },
    {
      id:'hsk2-3', number:3, titleZh:'左边那个红色的是我的', titleEn:'The red one on the left is mine',
      sourcePages:'HSK Standard Course 2 · Chapter 3',
      vocabulary:[['左边','zuǒbian','left side'],['旁边','pángbiān','beside'],['红色','hóngsè','red'],['颜色','yánsè','colour'],['手表','shǒubiǎo','watch'],['报纸','bàozhǐ','newspaper'],['送','sòng','to give'],['一下','yíxià','briefly'],['房间','fángjiān','room'],['牛奶','niúnǎi','milk']],
      objectives:['Use 的 to replace a known noun','Describe items by position and colour','Soften a short action with 一下','Ask and answer about ownership','Use 千 for prices and quantities'],
      reading:{title:'哪一个是你的？',sentences:['桌子上有三块手表。','左边那个红色的是我的，旁边那个黑色的是我丈夫的。','这块白色的手表是朋友送给我的。','你看一下，你喜欢哪个颜色？'],pinyin:'Zhuōzi shàng yǒu sān kuài shǒubiǎo. Zuǒbian nàge hóngsè de shì wǒ de, pángbiān nàge hēisè de shì wǒ zhàngfu de. Zhè kuài báisè de shǒubiǎo shì péngyou sòng gěi wǒ de. Nǐ kàn yíxià, nǐ xǐhuan nǎge yánsè?',en:'There are three watches on the table. The red one on the left is mine, and the black one beside it is my husband’s. A friend gave me the white watch. Take a look—which colour do you like?',source:'Adapted chapter reading'},
      summary:['When the noun is understood, adjective + 的 can stand alone.','Place expressions such as 左边 and 旁边 come before the described item.','Verb + 一下 makes a brief request sound softer.','Possessor + 的 can mean “the one belonging to…”.'],
      questions:[
        q('3-l-watch','listening','choice','Which watch belongs to the speaker?',{audio:'左边那个红色的是我的。',options:['The red one on the left','The black one on the right','The white one in the room','The watch beside the newspaper'],answer:'The red one on the left',explanation:'左边那个红色的 identifies the red one on the left.',source:'Chapter 3 dialogue'}),
        q('3-l-gift','listening','choice','What did the friend give?',{audio:'这块手表是朋友送给我的。',options:['A newspaper','A watch','Some milk','A room'],answer:'A watch',explanation:'手表 means wristwatch; 送给我 means gave to me.',source:'Chapter 3 dialogue'}),
        q('3-v-colour','vocabulary','choice','Which word means “colour”?',{options:['颜色','左边','一下','房间'],answer:'颜色',explanation:'颜色 means colour.',source:'Chapter 3 vocabulary'}),
        q('3-v-glance','vocabulary','choice','Complete the polite request “请看___。”',{options:['一下','千','旁边','送'],answer:'一下',explanation:'看一下 means take a quick look.',source:'Chapter 3 vocabulary'}),
        q('3-g-nominal','grammar','choice','Choose: “I want the red one.”',{options:['我要红色的。','我要的红色。','我红色的要。','我要红的色。'],answer:'我要红色的。',explanation:'红色的 replaces the understood noun.',source:'Chapter 3 grammar'}),
        q('3-g-owner','grammar','choice','Which phrase means “my husband’s (one)”?',{options:['我丈夫的','的我丈夫','我丈的夫','丈夫我的'],answer:'我丈夫的',explanation:'Add 的 after the possessor.',source:'Chapter 3 grammar'}),
        q('3-g-position','grammar','choice','Choose the natural phrase.',{options:['左边那个红色的','那个左边的红色','红色左边那个的','的那个红色左边'],answer:'左边那个红色的',explanation:'Position comes before the demonstrative and description.',source:'Chapter 3 grammar'}),
        q('3-g-soften','grammar','choice','Which request sounds natural and brief?',{options:['你看一下。','你一下看。','一下你看了。','你看的下。'],answer:'你看一下。',explanation:'Place 一下 after the verb.',source:'Chapter 3 grammar'}),
        q('3-p-order','production','order','Build: “The red one is mine.”',{tokens:['是','红色的','我的'],answer:['红色的','是','我的'],explanation:'The nominal phrase 红色的 is the subject.',source:'Chapter 3 practice'}),
        q('3-p-write','production','input','Complete: “左边那个是___。” (mine)',{accepted:['我的'],answer:'我的',placeholder:'Type two characters',explanation:'我的 can stand for “my one/mine.”',source:'Chapter 3 practice'})
      ]
    },
    {
      id:'hsk2-4', number:4, titleZh:'这个工作是他帮我介绍的', titleEn:'He helped me find this job',
      sourcePages:'HSK Standard Course 2 · Chapter 4',
      vocabulary:[['介绍','jièshào','to introduce'],['开始','kāishǐ','to begin'],['已经','yǐjīng','already'],['生日','shēngrì','birthday'],['晚上','wǎnshang','evening'],['非常','fēicháng','very'],['快乐','kuàilè','happy'],['给','gěi','to; for; give'],['问','wèn','to ask']],
      objectives:['Use 是……的 to emphasize past details','Identify who, when, where, or how an event happened','Use 已经 for an already completed change','Give and receive introductions','Talk about birthdays and starting work'],
      reading:{title:'我的新工作',sentences:['这个工作是朋友帮我介绍的。','我是去年九月开始工作的。','同事们对我非常好。','昨天是我的生日，他们晚上给我准备了一个蛋糕。'],pinyin:'Zhège gōngzuò shì péngyou bāng wǒ jièshào de. Wǒ shì qùnián jiǔyuè kāishǐ gōngzuò de. Tóngshìmen duì wǒ fēicháng hǎo. Zuótiān shì wǒ de shēngrì, tāmen wǎnshang gěi wǒ zhǔnbèi le yí ge dàngāo.',en:'A friend helped introduce me to this job. I started work last September. My colleagues are very kind. Yesterday was my birthday, and they prepared a cake for me in the evening.',source:'Adapted chapter reading'},
      summary:['是……的 highlights a detail about a completed event.','The emphasized person, time, place, or manner goes between 是 and 的.','已经 comes before the verb or adjective.','Do not use 是……的 simply to report that an event happened.'],
      questions:[
        q('4-l-job','listening','choice','Who introduced the job?',{audio:'这个工作是我朋友帮我介绍的。',options:['A friend','A teacher','A husband','A doctor'],answer:'A friend',explanation:'我朋友 is emphasized between 是 and 的.',source:'Chapter 4 dialogue'}),
        q('4-l-start','listening','choice','When did the speaker start work?',{audio:'我是去年九月开始工作的。',options:['Last September','This September','Last night','Two years ago'],answer:'Last September',explanation:'去年九月 means last September.',source:'Chapter 4 dialogue'}),
        q('4-v-begin','vocabulary','choice','Which word means “to begin”?',{options:['开始','介绍','快乐','已经'],answer:'开始',explanation:'开始 means begin or start.',source:'Chapter 4 vocabulary'}),
        q('4-v-already','vocabulary','choice','Complete “我___到公司了。”',{options:['已经','非常','晚上','生日'],answer:'已经',explanation:'已经 expresses “already.”',source:'Chapter 4 vocabulary'}),
        q('4-g-person','grammar','choice','Emphasize who bought the book.',{options:['这本书是我姐姐买的。','这本书我姐姐是买。','是这本书的我姐姐买。','这本书是买我姐姐的。'],answer:'这本书是我姐姐买的。',explanation:'The doer 我姐姐 appears after 是.',source:'Chapter 4 grammar'}),
        q('4-g-time','grammar','choice','Emphasize that you came yesterday.',{options:['我是昨天来的。','我昨天是来。','我是来的昨天。','昨天我来的。'],answer:'我是昨天来的。',explanation:'Put the emphasized time between 是 and the verb.',source:'Chapter 4 grammar'}),
        q('4-g-question','grammar','choice','Ask who introduced them.',{options:['是谁介绍你们认识的？','谁是你们的介绍认识？','你们是谁介绍认识？','是谁的介绍你们认识？'],answer:'是谁介绍你们认识的？',explanation:'谁 replaces the emphasized person in 是……的.',source:'Chapter 4 grammar'}),
        q('4-g-already','grammar','choice','Choose the correct placement of 已经.',{options:['他已经开始工作了。','他开始已经工作了。','已经他工作开始。','他工作了已经开始。'],answer:'他已经开始工作了。',explanation:'已经 normally comes before the verb phrase.',source:'Chapter 4 grammar'}),
        q('4-p-order','production','order','Build: “I came by bus.”',{tokens:['来的','我是','坐公共汽车'],answer:['我是','坐公共汽车','来的'],explanation:'Use 是 + manner + verb + 的.',source:'Chapter 4 practice'}),
        q('4-p-write','production','input','Complete: “这本书___朋友送给我的。”',{accepted:['是'],answer:'是',placeholder:'Type one character',explanation:'是 begins the emphatic 是……的 pattern.',source:'Chapter 4 practice'})
      ]
    },
    {
      id:'hsk2-5', number:5, titleZh:'就买这件吧', titleEn:'Let’s buy this one',
      sourcePages:'HSK Standard Course 2 · Chapter 5',
      vocabulary:[['件','jiàn','measure word for clothes'],['就','jiù','then; right away'],['吧','ba','suggestion particle'],['还','hái','still; also'],['可以','kěyǐ','can; may'],['准备','zhǔnbèi','to prepare'],['考试','kǎoshì','test'],['咖啡','kāfēi','coffee'],['卖','mài','to sell']],
      objectives:['Use 就 for an immediate decision','Make suggestions with 吧','Use 还 to mean still or additionally','Use measure words while shopping','Ask permission or possibility with 可以'],
      reading:{title:'买衣服',sentences:['明天有考试，我想买一件新衣服。','这件白色的怎么样？不大也不小。','我觉得很好看，就买这件吧。','商店还卖咖啡，我们休息一下再走。'],pinyin:'Míngtiān yǒu kǎoshì, wǒ xiǎng mǎi yí jiàn xīn yīfu. Zhè jiàn báisè de zěnmeyàng? Bú dà yě bù xiǎo. Wǒ juéde hěn hǎokàn, jiù mǎi zhè jiàn ba. Shāngdiàn hái mài kāfēi, wǒmen xiūxi yíxià zài zǒu.',en:'There is a test tomorrow, and I want to buy new clothes. How about this white one? It is neither big nor small. I think it looks good, so let’s buy it. The shop also sells coffee; we can rest before leaving.',source:'Adapted chapter reading'},
      summary:['就 can mark a decision made immediately from the situation.','吧 softens suggestions and decisions.','件 is the measure word for many items of clothing.','还 before a verb can mean also; before a state it can mean still.'],
      questions:[
        q('5-l-choice','listening','choice','What does the speaker decide?',{audio:'这件不大也不小，就买这件吧。',options:['Buy this one','Try a larger one','Leave the shop','Buy coffee only'],answer:'Buy this one',explanation:'就买这件吧 states the decision to buy this item.',source:'Chapter 5 dialogue'}),
        q('5-l-exam','listening','choice','What is happening tomorrow?',{audio:'明天有考试，我还没准备好。',options:['A test','A birthday','A trip','A football game'],answer:'A test',explanation:'考试 means test or exam.',source:'Chapter 5 dialogue'}),
        q('5-v-measure','vocabulary','choice','Choose the measure word for a shirt.',{options:['件','杯','本','块'],answer:'件',explanation:'一件衣服 uses 件.',source:'Chapter 5 vocabulary'}),
        q('5-v-sell','vocabulary','choice','Which word means “to sell”?',{options:['卖','买','准备','考试'],answer:'卖',explanation:'卖 is sell; 买 is buy.',source:'Chapter 5 vocabulary'}),
        q('5-g-suggestion','grammar','choice','Choose the natural suggestion.',{options:['我们休息一下吧。','吧我们休息一下。','我们吧休息的一下。','休息我们一下的吧。'],answer:'我们休息一下吧。',explanation:'吧 normally appears at the end of the suggestion.',source:'Chapter 5 grammar'}),
        q('5-g-decision','grammar','choice','Complete an immediate decision: “___买这件吧。”',{options:['就','还','对','可以'],answer:'就',explanation:'就 marks the decision: then/just buy this one.',source:'Chapter 5 grammar'}),
        q('5-g-still','grammar','choice','Which sentence means “I still have not prepared well”?',{options:['我还没准备好。','我没还准备好。','还我准备没好。','我准备还好没。'],answer:'我还没准备好。',explanation:'还 comes before the negative phrase 没准备好.',source:'Chapter 5 grammar'}),
        q('5-g-permission','grammar','choice','Ask permission to sit here.',{options:['我可以坐这儿吗？','我坐可以这儿吗？','可以吗我这儿坐？','我这儿吗可以坐？'],answer:'我可以坐这儿吗？',explanation:'可以 comes before the verb.',source:'Chapter 5 grammar'}),
        q('5-p-order','production','order','Build: “Let’s buy this one.”',{tokens:['吧','这件','就买'],answer:['就买','这件','吧'],explanation:'就 + verb phrase + 吧.',source:'Chapter 5 practice'}),
        q('5-p-write','production','input','Complete: “我们喝杯咖啡___。”',{accepted:['吧'],answer:'吧',placeholder:'Type one character',explanation:'Sentence-final 吧 makes this a suggestion.',source:'Chapter 5 practice'})
      ]
    },
    {
      id:'hsk2-6', number:6, titleZh:'你怎么不吃了', titleEn:'Why have you stopped eating?',
      sourcePages:'HSK Standard Course 2 · Chapter 6',
      vocabulary:[['因为','yīnwèi','because'],['所以','suǒyǐ','therefore'],['面条','miàntiáo','noodles'],['好吃','hǎochī','delicious'],['药','yào','medicine'],['游泳','yóuyǒng','to swim'],['打篮球','dǎ lánqiú','to play basketball'],['外边','wàibian','outside'],['眼睛','yǎnjing','eyes']],
      objectives:['Ask about an unexpected situation with 怎么','Connect cause and result with 因为……所以……','Recognize 了 as a change of situation','Explain health and food choices','Talk about sports and abilities'],
      reading:{title:'为什么不吃了？',sentences:['姐姐做的面条很好吃。','可是我今天生病了，吃了药，肚子不舒服。','因为我不能吃太多，所以我不吃了。','外边很热，我们也不去打篮球了。'],pinyin:'Jiějie zuò de miàntiáo hěn hǎochī. Kěshì wǒ jīntiān shēngbìng le, chī le yào, dùzi bù shūfu. Yīnwèi wǒ bù néng chī tài duō, suǒyǐ wǒ bù chī le. Wàibian hěn rè, wǒmen yě bú qù dǎ lánqiú le.',en:'My older sister’s noodles are delicious. But I am sick today and do not feel well after taking medicine. Because I cannot eat too much, I have stopped eating. It is hot outside, so we are not going to play basketball either.',source:'Adapted chapter reading'},
      summary:['怎么 + negative can ask why an expected action is not happening.','因为 introduces the cause; 所以 introduces the result.','Sentence-final 了 can show that a situation has changed.','不……了 means an action no longer continues.'],
      questions:[
        q('6-l-stop','listening','choice','Why has the speaker stopped eating?',{audio:'因为我有点儿不舒服，所以不吃了。',options:['The food is expensive','The speaker feels unwell','The noodles are cold','The speaker is late'],answer:'The speaker feels unwell',explanation:'不舒服 is the cause introduced after 因为.',source:'Chapter 6 dialogue'}),
        q('6-l-sport','listening','choice','What will they not do?',{audio:'外边下雨了，我们不去打篮球了。',options:['Play basketball','Take medicine','Eat noodles','Open the door'],answer:'Play basketball',explanation:'不去打篮球了 says they will no longer go play basketball.',source:'Chapter 6 dialogue'}),
        q('6-v-delicious','vocabulary','choice','Which word means “delicious”?',{options:['好吃','眼睛','外边','游泳'],answer:'好吃',explanation:'好吃 describes food that tastes good.',source:'Chapter 6 vocabulary'}),
        q('6-v-medicine','vocabulary','choice','What do you take when you are sick?',{options:['药','面条','篮球','眼睛'],answer:'药',explanation:'药 means medicine.',source:'Chapter 6 vocabulary'}),
        q('6-g-cause','grammar','choice','Choose the correct cause–result pair.',{options:['因为下雨，所以我不去。','所以下雨，因为我不去。','因为下雨，但是所以不去。','我因为所以不去下雨。'],answer:'因为下雨，所以我不去。',explanation:'因为 introduces the cause and 所以 the result.',source:'Chapter 6 grammar'}),
        q('6-g-unexpected','grammar','choice','Ask why someone is not eating.',{options:['你怎么不吃了？','你不吃怎么了的？','怎么你吃不了不？','你不怎么吃的了？'],answer:'你怎么不吃了？',explanation:'怎么 before the negative asks about the unexpected change.',source:'Chapter 6 grammar'}),
        q('6-g-change','grammar','choice','Which sentence means “I’m not going anymore”?',{options:['我不去了。','我没去的。','我不去过。','我去了不。'],answer:'我不去了。',explanation:'Sentence-final 了 marks the change from going to not going.',source:'Chapter 6 grammar'}),
        q('6-g-omit','grammar','choice','Which paired word can be omitted when the meaning stays clear?',{options:['所以','药','面条','眼睛'],answer:'所以',explanation:'In casual Chinese, 所以 can sometimes be omitted after a clear 因为 clause.',source:'Chapter 6 grammar'}),
        q('6-p-order','production','order','Build: “Because it is raining, we are not going.”',{tokens:['我们不去了','因为','下雨'],answer:['因为','下雨','我们不去了'],explanation:'State the cause, then the result.',source:'Chapter 6 practice'}),
        q('6-p-write','production','input','Complete: “因为我生病了，___我不去游泳。”',{accepted:['所以'],answer:'所以',placeholder:'Type two characters',explanation:'所以 introduces the result.',source:'Chapter 6 practice'})
      ]
    },
    {
      id:'hsk2-7', number:7, titleZh:'你家离公司远吗', titleEn:'Is your home far from the company?',
      sourcePages:'HSK Standard Course 2 · Chapter 7',
      vocabulary:[['离','lí','away from'],['远','yuǎn','far'],['近','jìn','near'],['公司','gōngsī','company'],['机场','jīchǎng','airport'],['公共汽车','gōnggòng qìchē','bus'],['小时','xiǎoshí','hour'],['快','kuài','fast'],['慢','màn','slow'],['到','dào','to arrive']],
      objectives:['Describe distance with A 离 B + adjective','Ask about distance with 远吗 or 多远','Express travel duration','Compare transportation choices','Use 到 for reaching a destination'],
      reading:{title:'上班的路',sentences:['我家离公司不太远。','坐公共汽车要四十分钟，走路要一个小时。','早上的车很慢，所以我常常早点儿出门。','从公司到机场很远，坐车也要一个多小时。'],pinyin:'Wǒ jiā lí gōngsī bú tài yuǎn. Zuò gōnggòng qìchē yào sìshí fēnzhōng, zǒulù yào yí ge xiǎoshí. Zǎoshang de chē hěn màn, suǒyǐ wǒ chángcháng zǎodiǎnr chūmén. Cóng gōngsī dào jīchǎng hěn yuǎn, zuò chē yě yào yí ge duō xiǎoshí.',en:'My home is not very far from the company. The bus takes forty minutes, while walking takes an hour. Morning traffic is slow, so I leave early. The airport is far from the company and takes over an hour by car.',source:'Adapted chapter reading'},
      summary:['A 离 B + 远/近 describes the distance between two places.','多远 asks how far; 多长时间 asks how long.','从 A 到 B marks a route from origin to destination.','A duration normally follows the verb phrase.'],
      questions:[
        q('7-l-duration','listening','choice','How long does the bus take?',{audio:'坐公共汽车到公司要四十分钟。',options:['14 minutes','40 minutes','1 hour','2 hours'],answer:'40 minutes',explanation:'四十分钟 means forty minutes.',source:'Chapter 7 dialogue'}),
        q('7-l-distance','listening','choice','What is close to the speaker’s home?',{audio:'我家离学校很近，走路五分钟就到。',options:['The school','The airport','The company','The station'],answer:'The school',explanation:'我家离学校很近 says the school is near home.',source:'Chapter 7 dialogue'}),
        q('7-v-far','vocabulary','choice','What is the opposite of 近?',{options:['远','快','到','离'],answer:'远',explanation:'远 is far; 近 is near.',source:'Chapter 7 vocabulary'}),
        q('7-v-bus','vocabulary','choice','Which word means “bus”?',{options:['公共汽车','机场','公司','小时'],answer:'公共汽车',explanation:'公共汽车 means bus.',source:'Chapter 7 vocabulary'}),
        q('7-g-distance','grammar','choice','Choose the correct sentence.',{options:['我家离公司很近。','我家很近离公司。','离我家公司很近。','我家公司的离近。'],answer:'我家离公司很近。',explanation:'Use A 离 B + distance adjective.',source:'Chapter 7 grammar'}),
        q('7-g-how-far','grammar','choice','Ask how far the airport is from here.',{options:['机场离这儿多远？','机场多离这儿远？','多远机场这儿离？','这儿机场离远多？'],answer:'机场离这儿多远？',explanation:'Replace the distance adjective with 多远.',source:'Chapter 7 grammar'}),
        q('7-g-route','grammar','choice','Choose “from home to the company.”',{options:['从家到公司','离家到公司','从公司离家','到家从公司'],answer:'从家到公司',explanation:'从 marks the origin and 到 the destination.',source:'Chapter 7 grammar'}),
        q('7-g-duration','grammar','choice','Choose the natural duration placement.',{options:['坐车要一个小时。','一个小时要坐车的。','坐一个小时要车。','要坐车小时一个。'],answer:'坐车要一个小时。',explanation:'要 + duration states how long the trip requires.',source:'Chapter 7 grammar'}),
        q('7-p-order','production','order','Build: “My home is far from the airport.”',{tokens:['很远','我家','离机场'],answer:['我家','离机场','很远'],explanation:'A + 离 B + adjective.',source:'Chapter 7 practice'}),
        q('7-p-write','production','input','Complete: “学校___我家很近。”',{accepted:['离'],answer:'离',placeholder:'Type one character',explanation:'离 connects the two locations.',source:'Chapter 7 practice'})
      ]
    },
    {
      id:'hsk2-8', number:8, titleZh:'让我想想再告诉你', titleEn:'Let me think, then I’ll tell you',
      sourcePages:'HSK Standard Course 2 · Chapter 8',
      vocabulary:[['让','ràng','to let; make'],['再','zài','then; again'],['告诉','gàosu','to tell'],['等','děng','to wait'],['找','zhǎo','to look for'],['服务员','fúwùyuán','server'],['事情','shìqing','matter'],['白','bái','white'],['黑','hēi','black'],['贵','guì','expensive']],
      objectives:['Use 让 in a request or causative sentence','Use 再 for a later or repeated action','Sequence actions with ……再……','Use polite 您 in service situations','Ask someone to wait, think, or explain'],
      reading:{title:'先看看，再决定',sentences:['服务员问我喜欢白色的还是黑色的。','我觉得两件都很好看，但是有一点儿贵。','我说：“请让我想想，明天再告诉您。”','朋友在外边等我，我得先去找他。'],pinyin:'Fúwùyuán wèn wǒ xǐhuan báisè de háishi hēisè de. Wǒ juéde liǎng jiàn dōu hěn hǎokàn, dànshì yǒu yìdiǎnr guì. Wǒ shuō: “Qǐng ràng wǒ xiǎngxiang, míngtiān zài gàosu nín.” Péngyou zài wàibian děng wǒ, wǒ děi xiān qù zhǎo tā.',en:'The salesperson asks whether I like the white or black one. Both look good, but they are a little expensive. I ask for time to think and say I will answer tomorrow. My friend is waiting outside, so I must find him first.',source:'Adapted chapter reading'},
      summary:['让 + person + verb means let or make someone do something.','再 points to an action that happens later or again in the future.','先……再…… clearly sequences two actions.','您 is the polite form of 你.'],
      questions:[
        q('8-l-decision','listening','choice','When will the speaker give an answer?',{audio:'让我想想，明天再告诉您。',options:['Right now','Tomorrow','Next week','Yesterday'],answer:'Tomorrow',explanation:'明天再告诉您 means “I’ll tell you tomorrow.”',source:'Chapter 8 dialogue'}),
        q('8-l-wait','listening','choice','What should the listener do?',{audio:'你在这儿等我，我去找服务员。',options:['Wait here','Go home','Buy the white one','Call tomorrow'],answer:'Wait here',explanation:'在这儿等我 means wait for me here.',source:'Chapter 8 dialogue'}),
        q('8-v-tell','vocabulary','choice','Which word means “to tell”?',{options:['告诉','让','找','等'],answer:'告诉',explanation:'告诉 is to tell or inform.',source:'Chapter 8 vocabulary'}),
        q('8-v-server','vocabulary','choice','Who helps customers in a restaurant or shop?',{options:['服务员','同学','丈夫','医生'],answer:'服务员',explanation:'服务员 is a server or attendant.',source:'Chapter 8 vocabulary'}),
        q('8-g-let','grammar','choice','Choose “Let me think.”',{options:['让我想想。','我让想想。','想想让我我。','让想我想。'],answer:'让我想想。',explanation:'让 + person + verb: 让 + 我 + 想想.',source:'Chapter 8 grammar'}),
        q('8-g-later','grammar','choice','Which sentence refers to doing it later?',{options:['我明天再来。','我昨天再来。','我再昨天来。','再我来了昨天。'],answer:'我明天再来。',explanation:'再 normally points to a future repeat or later action.',source:'Chapter 8 grammar'}),
        q('8-g-sequence','grammar','choice','Choose the correct sequence.',{options:['我先吃饭，再学习。','我再吃饭，先学习。','先我再吃饭学习。','我吃先饭学习再。'],answer:'我先吃饭，再学习。',explanation:'先 marks the first action and 再 the following action.',source:'Chapter 8 grammar'}),
        q('8-g-polite','grammar','choice','Which pronoun is polite when speaking to a customer?',{options:['您','你们','他们','它'],answer:'您',explanation:'您 is the respectful singular “you.”',source:'Chapter 8 grammar'}),
        q('8-p-order','production','order','Build: “Wait a moment, then tell me.”',{tokens:['再告诉我','等一下'],answer:['等一下','再告诉我'],explanation:'First wait; then tell.',source:'Chapter 8 practice'}),
        q('8-p-write','production','input','Complete: “先让我想想，___回答你。”',{accepted:['再'],answer:'再',placeholder:'Type one character',explanation:'再 introduces the later action.',source:'Chapter 8 practice'})
      ]
    },
    {
      id:'hsk2-9', number:9, titleZh:'题太多，我没做完', titleEn:'There were too many questions; I didn’t finish',
      sourcePages:'HSK Standard Course 2 · Chapter 9',
      vocabulary:[['题','tí','question'],['完','wán','to finish'],['懂','dǒng','to understand'],['错','cuò','wrong'],['问题','wèntí','problem; question'],['第一','dì-yī','first'],['希望','xīwàng','to hope'],['上班','shàngbān','to work'],['跳舞','tiàowǔ','to dance'],['踢足球','tī zúqiú','to play football']],
      objectives:['Use result complements such as 完、懂、错','Negate a completed result with 没','Distinguish action from achieved result','Use 太……了 for an excessive degree','Talk about exams, work, and abilities'],
      reading:{title:'今天的考试',sentences:['今天的考试题太多，我没做完。','第一题我看懂了，但是第二题做错了。','老师说有问题可以问他。','我希望下次考试能做完，也能都做对。'],pinyin:'Jīntiān de kǎoshì tí tài duō, wǒ méi zuòwán. Dì-yī tí wǒ kàndǒng le, dànshì dì-èr tí zuòcuò le. Lǎoshī shuō yǒu wèntí kěyǐ wèn tā. Wǒ xīwàng xià cì kǎoshì néng zuòwán, yě néng dōu zuòduì.',en:'There were too many questions in today’s test, and I did not finish. I understood the first but answered the second incorrectly. The teacher said we could ask questions. I hope to finish and answer everything correctly next time.',source:'Adapted chapter reading'},
      summary:['Verb + result complement shows the outcome of an action.','完 means finish, 懂 means understand successfully, and 错 means do incorrectly.','Use 没 before the verb to deny that a result was achieved.','太 + adjective + 了 means excessively or very.'],
      questions:[
        q('9-l-finish','listening','choice','What happened in the test?',{audio:'题太多，我没做完。',options:['The speaker did not finish','Every answer was correct','The test was cancelled','There was only one question'],answer:'The speaker did not finish',explanation:'没做完 denies achieving the result “finish.”',source:'Chapter 9 dialogue'}),
        q('9-l-understand','listening','choice','Which question did the speaker understand?',{audio:'第一题我看懂了，第二题没看懂。',options:['The first question','The second question','Both questions','Neither question'],answer:'The first question',explanation:'第一题我看懂了 states the first was understood.',source:'Chapter 9 dialogue'}),
        q('9-v-finish','vocabulary','choice','Which result complement means “finish”?',{options:['完','懂','错','题'],answer:'完',explanation:'做完 means finish doing.',source:'Chapter 9 vocabulary'}),
        q('9-v-wrong','vocabulary','choice','Complete “这个字我写___了。” (incorrectly)',{options:['错','完','懂','第一'],answer:'错',explanation:'写错 means write incorrectly.',source:'Chapter 9 vocabulary'}),
        q('9-g-result','grammar','choice','Choose “I understood it.”',{options:['我听懂了。','我懂听了。','我听了懂。','我听完懂。'],answer:'我听懂了。',explanation:'听 + 懂 shows successful understanding.',source:'Chapter 9 grammar'}),
        q('9-g-negative','grammar','choice','Choose “I didn’t finish reading.”',{options:['我没看完。','我不看完了。','我看没完。','我没完看。'],answer:'我没看完。',explanation:'Put 没 before the verb + result complement.',source:'Chapter 9 grammar'}),
        q('9-g-too','grammar','choice','Which sentence means there are too many questions?',{options:['题太多了。','题多太了。','太题多的。','题了太多。'],answer:'题太多了。',explanation:'The pattern is 太 + adjective + 了.',source:'Chapter 9 grammar'}),
        q('9-g-action-result','grammar','choice','Which sentence confirms the meal was fully eaten?',{options:['我吃完了。','我吃了。','我在吃。','我要吃。'],answer:'我吃完了。',explanation:'完 explicitly marks completion; 吃了 alone only marks the event.',source:'Chapter 9 grammar'}),
        q('9-p-order','production','order','Build: “I did not understand the question.”',{tokens:['没看懂','我','这个问题'],answer:['我','没看懂','这个问题'],explanation:'Subject + 没 + verb-result + object.',source:'Chapter 9 practice'}),
        q('9-p-write','production','input','Complete: “作业太多，我没做___。”',{accepted:['完'],answer:'完',placeholder:'Type one character',explanation:'做完 means finish doing.',source:'Chapter 9 practice'})
      ]
    },
    {
      id:'hsk2-10', number:10, titleZh:'别找了，手机在桌子上呢', titleEn:'Stop looking—the phone is on the table',
      sourcePages:'HSK Standard Course 2 · Chapter 10',
      vocabulary:[['别','bié','do not'],['手机','shǒujī','mobile phone'],['正在','zhèngzài','currently'],['帮助','bāngzhù','to help'],['哥哥','gēge','older brother'],['课','kè','lesson'],['洗','xǐ','to wash'],['鸡蛋','jīdàn','egg'],['西瓜','xīguā','watermelon']],
      objectives:['Make a negative command with 别……了','Describe an action in progress with 正在','Say where an object or person is located','Use 呢 to draw attention to a current state','Talk about finding and helping'],
      reading:{title:'手机在哪儿？',sentences:['我正在找手机，哥哥也来帮助我。','他问：“你是不是把手机放在房间里了？”','妈妈说：“别找了，手机在桌子上呢。”','原来手机在西瓜和鸡蛋旁边。'],pinyin:'Wǒ zhèngzài zhǎo shǒujī, gēge yě lái bāngzhù wǒ. Tā wèn: “Nǐ shì bú shì bǎ shǒujī fàng zài fángjiān li le?” Māma shuō: “Bié zhǎo le, shǒujī zài zhuōzi shàng ne.” Yuánlái shǒujī zài xīguā hé jīdàn pángbiān.',en:'I am looking for my phone, and my older brother helps. He asks whether I left it in the room. Mum says to stop looking because it is on the table. It turns out to be beside the watermelon and eggs.',source:'Adapted chapter reading'},
      summary:['别 + verb + 了 tells someone to stop or not do an action.','正在 comes before the verb to mark an action in progress.','Place + 有 introduces something at a location; person/thing + 在 states its location.','呢 can highlight an ongoing action or current location.'],
      questions:[
        q('10-l-location','listening','choice','Where is the phone?',{audio:'别找了，手机在桌子上呢。',options:['On the table','In the bag','Under the chair','At school'],answer:'On the table',explanation:'在桌子上 means on the table.',source:'Chapter 10 dialogue'}),
        q('10-l-action','listening','choice','What is the older brother doing?',{audio:'哥哥正在洗西瓜呢。',options:['Washing a watermelon','Looking for a phone','Cooking eggs','Having a lesson'],answer:'Washing a watermelon',explanation:'正在洗 marks the action now.',source:'Chapter 10 dialogue'}),
        q('10-v-phone','vocabulary','choice','Which word means “mobile phone”?',{options:['手机','帮助','鸡蛋','课'],answer:'手机',explanation:'手机 is a mobile phone.',source:'Chapter 10 vocabulary'}),
        q('10-v-help','vocabulary','choice','Which word means “to help”?',{options:['帮助','正在','洗','别'],answer:'帮助',explanation:'帮助 means to help.',source:'Chapter 10 vocabulary'}),
        q('10-g-command','grammar','choice','Tell someone to stop looking.',{options:['别找了。','不找别。','别了找。','找别的了。'],answer:'别找了。',explanation:'别 + verb + 了 is the chapter pattern.',source:'Chapter 10 grammar'}),
        q('10-g-progress','grammar','choice','Choose “I am studying Chinese now.”',{options:['我正在学习汉语。','我学习正在汉语。','正在我汉语学习。','我汉语正在的学习。'],answer:'我正在学习汉语。',explanation:'正在 comes after the subject and before the verb.',source:'Chapter 10 grammar'}),
        q('10-g-location','grammar','choice','Choose the correct location sentence.',{options:['手机在桌子上。','桌子手机在上。','手机桌子上在。','在手机桌子上。'],answer:'手机在桌子上。',explanation:'Thing + 在 + location.',source:'Chapter 10 grammar'}),
        q('10-g-you','grammar','choice','Which sentence naturally asks what someone is doing now?',{options:['你在做什么呢？','你做呢什么在？','呢你在什么做？','你什么正在呢做？'],answer:'你在做什么呢？',explanation:'在 + verb marks the current action; 呢 fits the ongoing situation.',source:'Chapter 10 grammar'}),
        q('10-p-order','production','order','Build: “The eggs are on the table.”',{tokens:['桌子上','鸡蛋','在'],answer:['鸡蛋','在','桌子上'],explanation:'Thing + 在 + location.',source:'Chapter 10 practice'}),
        q('10-p-write','production','input','Complete: “我___看书呢。”',{accepted:['正在','在'],answer:'正在',placeholder:'Type 在 or 正在',explanation:'正在/在 before the verb marks an action in progress.',source:'Chapter 10 practice'})
      ]
    }
  ];

  curriculum.version=6;
  curriculum.tests=[
    {id:'core',number:1,title:'Core language',description:'Vocabulary, sentence patterns, and guided production.',count:8,skills:['vocabulary','grammar','production']},
    {id:'comprehension',number:2,title:'Listening & meaning',description:'Audio-first comprehension with language-in-context checks.',count:8,skills:['listening','vocabulary','grammar']},
    {id:'mastery',number:3,title:'Chapter mastery',description:'A mixed closed-book checkpoint across every chapter skill.',count:12,skills:['listening','vocabulary','grammar','production']}
  ];
  curriculum.chapters=[...chapters,...curriculum.chapters.filter(chapter=>chapter.number>10)].sort((a,b)=>a.number-b.number);
  window.HSK_STUDY_CURRICULUM=curriculum;
})();
