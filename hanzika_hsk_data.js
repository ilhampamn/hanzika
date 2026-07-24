(function(){
  const q = (id, skill, type, prompt, config) => ({ id, skill, type, prompt, ...config });

  window.HSK_REVIEW_CURRICULUM = {
    version: 4,
    level: 2,
    source: 'HSK Standard Course 2',
    chapters: [
      {
        id: 'hsk2-11',
        number: 11,
        titleZh: '他比我大三岁',
        titleEn: 'He is three years older than me',
        sourcePages: 'Textbook 81–88 · PDF 101–108',
        color: 'blue',
        vocabulary: [
          ['唱歌','chàng gē','to sing'], ['男','nán','male'], ['女','nǚ','female'],
          ['孩子','háizi','child'], ['右边','yòubian','right side'], ['比','bǐ','than; compare'],
          ['便宜','piányi','inexpensive'], ['说话','shuōhuà','to speak'],
          ['可能','kěnéng','maybe; probably'], ['去年','qùnián','last year'], ['姓','xìng','surname']
        ],
        objectives: [
          'Build verb-phrase attributives with 的',
          'Compare people and things with 比',
          'Express negative comparisons with 没有',
          'Describe small, large, and exact differences',
          'Use 可能 to make a careful estimate'
        ],
        reading: {
          title: '我的哥哥',
          zh: '我哥哥今年二十五岁，我比他小三岁。他比我高一点儿，也比我大三岁。去年同学给我介绍了一个朋友，她可能不认识我哥哥。右边正在说话的男孩子就是我哥哥。',
          sentences: [
            '我哥哥今年二十五岁，我比他小三岁。',
            '他比我高一点儿，也比我大三岁。',
            '去年同学给我介绍了一个朋友，她可能不认识我哥哥。',
            '右边正在说话的男孩子就是我哥哥。'
          ],
          pinyin: 'Wǒ gēge jīnnián èrshíwǔ suì, wǒ bǐ tā xiǎo sān suì. Tā bǐ wǒ gāo yìdiǎnr, yě bǐ wǒ dà sān suì. Qùnián tóngxué gěi wǒ jièshào le yí ge péngyou, tā kěnéng bù rènshi wǒ gēge. Yòubian zhèngzài shuōhuà de nánháizi jiù shì wǒ gēge.',
          en: 'My older brother is twenty-five this year, and I am three years younger than him. He is a little taller than me and three years older. Last year a classmate introduced a friend to me; she may not know my brother. The boy speaking on the right is my brother.',
          source: 'Adapted from dialogues 11-1–11-4'
        },
        summary: [
          'A 比 B + adjective compares two people or things.',
          'Add 一点儿/一些, 得多, or an exact quantity to show the size of a difference.',
          'A 没有 B + adjective forms a negative comparison.',
          'A verb phrase before a noun takes 的; 可能 introduces a careful estimate.'
        ],
        questions: [
          q('11-l-age','listening','choice','Listen and work out the younger person’s age.',{
            audio:'我哥哥二十五岁，他比我大三岁。', options:['20岁','21岁','22岁','28岁'], answer:'22岁',
            explanation:'25 − 3 = 22. “他比我大三岁” means he is three years older than me.', source:'11-2'
          }),
          q('11-l-acquaintance','listening','choice','What can you safely conclude about the man?',{
            audio:'他不是我男朋友，是同学介绍的，我们昨天第一次见。', options:['They are classmates.','They just met through a classmate.','They have dated for a year.','He is her older brother.'], answer:'They just met through a classmate.',
            explanation:'The speaker rejects “boyfriend” and says they met for the first time yesterday.', source:'11-1'
          }),
          q('11-l-price','listening','choice','Which statement matches the audio?',{
            audio:'今天苹果比昨天便宜一些。', options:['Apples are much more expensive today.','Apples are a little cheaper today.','Apples cost exactly two yuan less.','Yesterday’s apples were cheaper.'], answer:'Apples are a little cheaper today.',
            explanation:'便宜一些 marks a small difference: “a little cheaper.”', source:'11-3'
          }),
          q('11-v-possible','vocabulary','choice','Which word makes this a cautious estimate: “She ___ does not know him”?',{
            stem:'她___不认识他。', options:['去年','可能','便宜','一起'], answer:'可能',
            explanation:'可能 can appear before the verb phrase to mean “maybe/probably.”', source:'Notes p.85'
          }),
          q('11-v-cheap','vocabulary','choice','A shop lowers a price from ¥8 to ¥6. Which description is correct?',{
            options:['更贵了','便宜了','一样大','可能了'], answer:'便宜了',
            explanation:'便宜 means inexpensive or cheaper.', source:'11-3'
          }),
          q('11-g-attributive','grammar','choice','Choose the correctly formed noun phrase.',{
            options:['左边看报纸女孩子','左边的看报纸女孩子','左边看报纸的女孩子','左边看得报纸的女孩子'], answer:'左边看报纸的女孩子',
            explanation:'A verb phrase used before a noun takes 的: 看报纸 + 的 + 女孩子.', source:'Notes p.84'
          }),
          q('11-g-negative','grammar','choice','Choose the natural negative equivalent of “今天比昨天热”.',{
            options:['今天不比昨天热。','昨天没有今天热。','昨天不有今天热。','今天没有昨天很热。'], answer:'昨天没有今天热。',
            explanation:'The chapter’s negative comparison pattern is A 没有 B + adjective.', source:'Notes p.84'
          }),
          q('11-g-small-diff','grammar','choice','Which sentence clearly expresses only a small difference?',{
            options:['今天比昨天热两度。','今天比昨天热一些。','今天比昨天热得多。','今天没有昨天热。'], answer:'今天比昨天热一些。',
            explanation:'一点儿/一些 signals a small difference; 得多 signals a large one.', source:'Notes p.85'
          }),
          q('11-g-exact-diff','grammar','choice','Which sentence gives an exact age difference?',{
            options:['姐姐比我大一些。','姐姐比我大得多。','姐姐比我大两岁。','姐姐没有我大。'], answer:'姐姐比我大两岁。',
            explanation:'A specific number can follow the adjective: 大 + 两岁.', source:'Notes p.85'
          }),
          q('11-g-large-diff','grammar','choice','You want to say one phone is much more expensive. Choose the best sentence.',{
            options:['这个手机比那个手机贵一点儿。','这个手机比那个手机贵得多。','这个手机没有那个手机贵。','这个手机比那个手机两块钱。'], answer:'这个手机比那个手机贵得多。',
            explanation:'得多 emphasizes a large difference.', source:'Notes p.85'
          }),
          q('11-p-order-attributive','production','order','Build: “The girl reading on the left is my older sister.”',{
            tokens:['是我姐姐','左边','的女孩子','看报纸'], answer:['左边','看报纸','的女孩子','是我姐姐'],
            explanation:'Place the full modifier before 的: 左边看报纸的女孩子.', source:'11-2'
          }),
          q('11-p-order-possible','production','order','Build a natural sentence meaning “Teacher Wang may not know this student.”',{
            tokens:['这个学生','可能','王老师','不认识'], answer:['王老师','可能','不认识','这个学生'],
            explanation:'可能 normally comes before the verb phrase 不认识.', source:'Notes p.85'
          }),
          q('11-p-rewrite','production','input','Rewrite with 没有: “今天比昨天热。”',{
            accepted:['昨天没有今天热','昨天没有今天热。'], answer:'昨天没有今天热。',
            explanation:'Reverse A and B, then use A 没有 B + adjective.', source:'Notes p.84'
          }),
          q('11-p-infer-name','production','input','Complete with one character: “她___王，今年二十八岁。”',{
            accepted:['姓'], answer:'姓', placeholder:'Type one character',
            explanation:'姓 introduces a family name: 她姓王.', source:'11-4'
          })
        ]
      },
      {
        id: 'hsk2-12',
        number: 12,
        titleZh: '你穿得太少了',
        titleEn: 'You wear too little',
        sourcePages: 'Textbook 89–96 · PDF 109–116',
        color: 'green',
        vocabulary: [
          ['得','de','degree-complement marker'], ['妻子','qīzi','wife'], ['雪','xuě','snow'],
          ['零','líng','zero'], ['度','dù','degree'], ['穿','chuān','to wear'],
          ['进','jìn','to enter'], ['弟弟','dìdi','younger brother'], ['近','jìn','near']
        ],
        objectives: [
          'Describe performance with complements of degree',
          'Place objects correctly when using 得',
          'Negate and question a degree complement',
          'Compare how well actions are performed',
          'Infer meaning from weather and daily-life audio'
        ],
        reading: {
          title: '弟弟的新房子',
          zh: '我弟弟每天早上六点起床。他跑步跑得很快，所以身体很好。今天外边下雪了，零下十度。他穿得太少了，我让他进房间。他希望以后住得离公司近一点儿。',
          sentences: [
            '我弟弟每天早上六点起床。',
            '他跑步跑得很快，所以身体很好。',
            '今天外边下雪了，零下十度。',
            '他穿得太少了，我让他进房间。',
            '他希望以后住得离公司近一点儿。'
          ],
          pinyin: 'Wǒ dìdi měitiān zǎoshang liù diǎn qǐchuáng. Tā pǎobù pǎo de hěn kuài, suǒyǐ shēntǐ hěn hǎo. Jīntiān wàibian xià xuě le, língxià shí dù. Tā chuān de tài shǎo le, wǒ ràng tā jìn fángjiān. Tā xīwàng yǐhòu zhù de lí gōngsī jìn yìdiǎnr.',
          en: 'My younger brother gets up at six every morning. He runs very fast, so he is healthy. It is snowing outside today and is ten degrees below zero. He is wearing too little, so I ask him to come inside. He hopes to live a little closer to his company in the future.',
          source: 'Adapted from dialogues 12-1–12-4'
        },
        summary: [
          'Verb + 得 + adjective describes how well, fast, early, or much an action is done.',
          'With an object, place it before the verb or repeat the verb: 他汉语说得很好 / 他写汉字写得很好.',
          'Put 不 after 得 to negate the complement: 说得不好.',
          'Compare performance with A 比 B + Verb + 得 + adjective.'
        ],
        questions: [
          q('12-l-weather','listening','choice','What should the listener probably do next?',{
            audio:'外边零下十度，你穿得太少了，我们进房间吧。', options:['Put on summer clothes.','Go inside.','Open the window.','Buy a thermometer.'], answer:'Go inside.',
            explanation:'It is ten below zero and the speaker explicitly suggests going into the room.', source:'12-3'
          }),
          q('12-l-cooking','listening','choice','Who is the better cook?',{
            audio:'我做饭做得不怎么样，我妻子比我做得好。', options:['The speaker','The speaker’s wife','The speaker’s brother','They cook equally well'], answer:'The speaker’s wife',
            explanation:'妻子比我做得好 means the wife does it better than the speaker.', source:'12-2'
          }),
          q('12-l-routine','listening','choice','Why does the speaker get up early?',{
            audio:'我每天晚上十点就睡觉。早睡早起身体好。', options:['The speaker works at night.','The speaker believes early hours are healthy.','The speaker cannot sleep.','The speaker lives near work.'], answer:'The speaker believes early hours are healthy.',
            explanation:'早睡早起身体好 gives the reason directly.', source:'12-1'
          }),
          q('12-v-de','vocabulary','choice','What is 得 doing in “他说得很好”?',{
            options:['Marking possession','Introducing degree','Marking completed action','Creating a comparison noun'], answer:'Introducing degree',
            explanation:'Here 得 connects the action 说 with how well it is performed.', source:'Notes p.92'
          }),
          q('12-v-near','vocabulary','choice','Which word completes “他想住得___一点儿” (He wants to live a little nearer)?',{
            options:['雪','近','零','进'], answer:'近',
            explanation:'近 is the adjective “near”; 进 is the verb “enter.”', source:'12-4'
          }),
          q('12-g-basic','grammar','choice','Choose the correct sentence.',{
            options:['他说很好得。','他说得很好。','他得说很好。','他说很得好。'], answer:'他说得很好。',
            explanation:'The core pattern is Verb + 得 + adjective.', source:'Notes p.92'
          }),
          q('12-g-object','grammar','choice','Which sentence correctly includes the object 汉语?',{
            options:['他说得汉语很好。','他汉语说得很好。','他得说汉语很好。','他汉语得说很好。'], answer:'他汉语说得很好。',
            explanation:'With an object, move it before the verb or repeat the verb.', source:'Notes p.92'
          }),
          q('12-g-repeat','grammar','choice','Choose the valid verb-repetition pattern.',{
            options:['她唱歌得很好。','她唱歌唱得很好。','她唱得歌很好。','她得唱歌很好。'], answer:'她唱歌唱得很好。',
            explanation:'The alternative pattern repeats the verb: 唱歌 + 唱得很好.', source:'Notes p.92'
          }),
          q('12-g-negative','grammar','choice','Choose the correct negative degree complement.',{
            options:['他说不很好得。','他不说得很好。','他说得不好。','他说不得很好。'], answer:'他说得不好。',
            explanation:'The negative word comes after 得: 说得不好.', source:'Notes p.92'
          }),
          q('12-g-question','grammar','choice','How do you ask whether he lives far?',{
            options:['他住不住得远？','他住得远不远？','他不住得远吗？','他住远得不远？'], answer:'他住得远不远？',
            explanation:'The chapter uses 得 + Adj + 不 + Adj for this question form.', source:'Notes p.93'
          }),
          q('12-g-compare-1','grammar','choice','Choose a valid comparison of running speed.',{
            options:['我比大卫跑得快。','我跑比大卫得快。','我得跑比大卫快。','我跑得快大卫比。'], answer:'我比大卫跑得快。',
            explanation:'One valid pattern is A 比 B + Verb + 得 + adjective.', source:'Notes p.93'
          }),
          q('12-g-compare-2','grammar','choice','Choose the other valid comparison pattern.',{
            options:['我唱得比安妮好。','我唱比安妮得好。','我比唱得安妮好。','我得唱比安妮好。'], answer:'我唱得比安妮好。',
            explanation:'The second pattern places 比 before B inside the complement: A + V得 + 比B + adjective.', source:'Notes p.93'
          }),
          q('12-p-order','production','order','Build: “My wife cooks better than I do.”',{
            tokens:['做得好','我妻子','比我'], answer:['我妻子','比我','做得好'],
            explanation:'Use A 比 B + V得 + adjective.', source:'12-2'
          }),
          q('12-p-write','production','input','Write in Chinese: “He writes Chinese characters very well.”',{
            accepted:['他汉字写得很好','他汉字写得很好。','他写汉字写得很好','他写汉字写得很好。'], answer:'他汉字写得很好。',
            placeholder:'Type the complete sentence',
            explanation:'Put the object before the verb, or repeat 写 after 写汉字.', source:'Notes p.92'
          })
        ]
      },
      {
        id: 'hsk2-13',
        number: 13,
        titleZh: '门开着呢',
        titleEn: 'The door is open',
        sourcePages: 'Textbook 97–104 · PDF 117–124',
        color: 'orange',
        vocabulary: [
          ['着','zhe','particle marking a continuing state'], ['手','shǒu','hand'],
          ['拿','ná','to hold; to take'], ['铅笔','qiānbǐ','pencil'],
          ['班','bān','class; group'], ['长','zhǎng','to grow; to have a feature'],
          ['笑','xiào','to smile; to laugh'], ['宾馆','bīnguǎn','hotel; guesthouse'],
          ['一直','yìzhí','straight; continuously'], ['往','wǎng','toward'],
          ['路口','lùkǒu','intersection'], ['杨笑笑','Yáng Xiàoxiao','Yang Xiaoxiao']
        ],
        objectives: [
          'Describe a continuing state with Verb + 着',
          'Negate and question states expressed with 着',
          'Use 不是……吗 to remind, confirm, or express surprise',
          'Give directions with 往 + direction + verb',
          'Identify people through visible features and actions'
        ],
        reading: {
          title: '去新京宾馆',
          zh: '办公室的门开着呢。一个女孩儿手里拿着铅笔，她叫杨笑笑。她不是我们班的同学吗？她笑着问：“新京宾馆怎么走？”我告诉她：“从这儿一直往前走，到了路口再往右走。”',
          sentences: [
            '办公室的门开着呢。',
            '一个女孩儿手里拿着铅笔，她叫杨笑笑。',
            '她不是我们班的同学吗？',
            '她笑着问：“新京宾馆怎么走？”',
            '我告诉她：“从这儿一直往前走，到了路口再往右走。”'
          ],
          pinyin: 'Bàngōngshì de mén kāizhe ne. Yí ge nǚháir shǒu li názhe qiānbǐ, tā jiào Yáng Xiàoxiao. Tā bú shì wǒmen bān de tóngxué ma? Tā xiàozhe wèn: “Xīnjīng Bīnguǎn zěnme zǒu?” Wǒ gàosu tā: “Cóng zhèr yìzhí wǎng qián zǒu, dào le lùkǒu zài wǎng yòu zǒu.”',
          en: 'The office door is open. A girl is holding a pencil; her name is Yang Xiaoxiao. Isn’t she a classmate of ours? Smiling, she asks how to reach Xinjing Hotel. I tell her to walk straight ahead and turn right at the intersection.',
          source: 'Adapted from dialogues 13-1–13-4'
        },
        summary: [
          'Verb + 着 presents a continuing state: 门开着 and 手里拿着铅笔.',
          'Use 没(有) before the verb to negate the state; ask with Verb + 着 + 没有.',
          '不是……吗 is a rhetorical question used to remind, confirm, or show surprise.',
          'Use 往 + direction + verb to give directions: 往前走, 往右走.'
        ],
        questions: [
          q('13-l-office','listening','choice','What should the visitor do?',{
            audio:'张先生出去了，你下午再来吧。', options:['Wait inside all morning.','Come back in the afternoon.','Call Mr. Zhang tonight.','Close the office door.'], answer:'Come back in the afternoon.',
            explanation:'张先生出去了 says Mr. Zhang has gone out, and 下午再来 asks the visitor to return in the afternoon.', source:'13-1'
          }),
          q('13-l-pencil','listening','choice','Which person is the speaker asking about?',{
            audio:'那个手里拿着铅笔的呢？', options:['The person holding a pencil','The person opening the door','The person at the intersection','The person wearing red'], answer:'The person holding a pencil',
            explanation:'手里拿着铅笔 describes someone with a pencil held in their hand.', source:'13-2'
          }),
          q('13-l-directions','listening','choice','What should you do at the intersection?',{
            audio:'从这儿一直往前走，到了前面的路口再往右走。', options:['Turn left.','Turn right.','Go back.','Enter the hotel.'], answer:'Turn right.',
            explanation:'到了前面的路口再往右走 means to turn right after reaching the intersection ahead.', source:'13-4'
          }),
          q('13-v-hotel','vocabulary','choice','Which word means “hotel” or “guesthouse”?',{
            options:['宾馆','路口','铅笔','班'], answer:'宾馆',
            explanation:'宾馆 is a hotel or guesthouse.', source:'Vocabulary p.98'
          }),
          q('13-v-intersection','vocabulary','choice','You are told to turn at the 路口. Where do you turn?',{
            options:['At the intersection','At the office','At the classroom','At the hotel room'], answer:'At the intersection',
            explanation:'路口 is a crossing or intersection.', source:'Vocabulary p.99'
          }),
          q('13-g-state','grammar','choice','Choose the sentence that describes a continuing state.',{
            options:['门开着呢。','门开了呢。','门要开呢。','门开过呢。'], answer:'门开着呢。',
            explanation:'Verb + 着 describes a state that continues: the door is in an open state.', source:'Notes pp.100–101'
          }),
          q('13-g-negative','grammar','choice','Choose the correct negative form of “他拿着铅笔”.',{
            options:['他不拿着铅笔。','他没拿着铅笔。','他拿没着铅笔。','他没有着拿铅笔。'], answer:'他没拿着铅笔。',
            explanation:'A continuing state with 着 is normally negated with 没(有) before the verb.', source:'Notes pp.100–101'
          }),
          q('13-g-question','grammar','choice','Choose the correct question asking whether the door is open.',{
            options:['门开着没有？','门开没有着？','门有没有着开？','门着开吗没有？'], answer:'门开着没有？',
            explanation:'One chapter pattern asks about a state with Verb + 着 + 没有.', source:'Notes pp.100–101'
          }),
          q('13-g-rhetorical','grammar','choice','Which sentence naturally reminds someone of information they should already know?',{
            options:['她不是有男朋友吗？','她没有男朋友吗不是？','她是不是吗有男朋友？','她有男朋友不是。'], answer:'她不是有男朋友吗？',
            explanation:'不是……吗 is a rhetorical question used here to remind or show surprise.', source:'Notes p.101'
          }),
          q('13-g-direction','grammar','choice','Choose the natural direction phrase.',{
            options:['往右走','右往走','走往右','往走右'], answer:'往右走',
            explanation:'Use 往 + direction + verb: 往右走, “walk/turn to the right.”', source:'Notes p.102'
          }),
          q('13-p-order-state','production','order','Build: “The girl is holding a pencil in her hand.”',{
            tokens:['拿着','女孩儿','手里','铅笔'], answer:['女孩儿','手里','拿着','铅笔'],
            explanation:'Place the location before the state verb: 女孩儿 + 手里 + 拿着 + 铅笔.', source:'13-2'
          }),
          q('13-p-order-directions','production','order','Build: “Walk straight ahead from here.”',{
            tokens:['一直','从这儿','走','往前'], answer:['从这儿','一直','往前','走'],
            explanation:'The course direction pattern is 从这儿 + 一直 + 往前 + 走.', source:'13-4'
          }),
          q('13-p-write-state','production','input','Write in Chinese: “The door is open.”',{
            accepted:['门开着','门开着。','门开着呢','门开着呢。'], answer:'门开着呢。',
            placeholder:'Type the complete sentence',
            explanation:'Use 开着 to describe the door’s continuing open state.', source:'13-1'
          }),
          q('13-p-write-reminder','production','input','Complete the rhetorical reminder: “你___知道他是谁吗？”',{
            accepted:['不是'], answer:'不是', placeholder:'Type two characters',
            explanation:'不是……吗 frames the question as a reminder: “Don’t you know who he is?”', source:'Notes p.101'
          })
        ]
      },
      {
        id: 'hsk2-14',
        number: 14,
        titleZh: '你看过那个电影吗',
        titleEn: 'Have you seen that movie?',
        sourcePages: 'Textbook 105–112 · PDF 125–132',
        color: 'purple',
        vocabulary: [
          ['意思','yìsi','meaning; interest'], ['但是','dànshì','but; however'],
          ['虽然','suīrán','although; though'], ['次','cì','time; occurrence'],
          ['玩儿','wánr','to play; to have fun'], ['晴','qíng','sunny; clear'],
          ['百','bǎi','hundred']
        ],
        objectives: [
          'Talk about past experiences with Verb + 过',
          'Negate and question past experience with 没(有)',
          'Connect contrasting ideas with 虽然……但是……',
          'Count how many times an action happened with 次',
          'Distinguish a past experience from a completed event'
        ],
        reading: {
          title: '一起去看电影',
          zh: '我没看过那个电影，听说很有意思。我的朋友虽然看过两次，但是还想再看。明天虽然是晴天，但是很冷，我们不去跑步，准备一起去看电影。电影票两百块，有一点儿贵。',
          sentences: [
            '我没看过那个电影，听说很有意思。',
            '我的朋友虽然看过两次，但是还想再看。',
            '明天虽然是晴天，但是很冷，我们不去跑步，准备一起去看电影。',
            '电影票两百块，有一点儿贵。'
          ],
          pinyin: 'Wǒ méi kànguo nàge diànyǐng, tīngshuō hěn yǒu yìsi. Wǒ de péngyou suīrán kànguo liǎng cì, dànshì hái xiǎng zài kàn. Míngtiān suīrán shì qíngtiān, dànshì hěn lěng, wǒmen bú qù pǎobù, zhǔnbèi yìqǐ qù kàn diànyǐng. Diànyǐngpiào liǎngbǎi kuài, yǒu yìdiǎnr guì.',
          en: 'I have not seen that movie, but I have heard it is interesting. Although my friend has seen it twice, they still want to watch it again. Tomorrow will be sunny but cold, so instead of running we plan to see the movie together. The ticket costs two hundred yuan, which is a little expensive.',
          source: 'Adapted from dialogues 14-1–14-4'
        },
        summary: [
          'Verb + 过 talks about an experience at some time in the past.',
          'Negate the experience with 没(有) + Verb + 过; ask with 吗 or ……过没有.',
          '虽然 introduces a concession and 但是 introduces the contrasting result.',
          'Number + 次 counts how many times an action has occurred.'
        ],
        questions: [
          q('14-l-movie','listening','choice','What does the speaker know about the movie?',{
            audio:'我没看过那个电影，听说很有意思。', options:['They have seen it twice.','They have not seen it but heard it is interesting.','They think it is too expensive.','They watched it last week.'], answer:'They have not seen it but heard it is interesting.',
            explanation:'没看过 denies the experience; 听说很有意思 reports what the speaker has heard.', source:'14-1'
          }),
          q('14-l-china','listening','choice','Which statement is true?',{
            audio:'我虽然去过中国好几次，但是还想再去玩儿玩儿。', options:['The speaker has never visited China.','The speaker visited once and disliked it.','The speaker has visited several times and wants to return.','The speaker lives in China now.'], answer:'The speaker has visited several times and wants to return.',
            explanation:'去过好几次 gives repeated past experience, while 还想再去 says the speaker wants to go again.', source:'14-2'
          }),
          q('14-l-weather','listening','choice','How will the weather be?',{
            audio:'明天虽然是晴天，但是很冷。', options:['Sunny but cold','Cloudy and warm','Snowy but warm','Rainy and windy'], answer:'Sunny but cold',
            explanation:'虽然是晴天，但是很冷 contrasts clear skies with cold weather.', source:'14-3'
          }),
          q('14-v-interesting','vocabulary','choice','Complete “这个电影很有___” to mean “This movie is interesting.”',{
            options:['意思','但是','次','百'], answer:'意思',
            explanation:'有意思 means interesting or fun.', source:'14-1'
          }),
          q('14-v-frequency','vocabulary','choice','Which word counts occurrences, as in “three times”?',{
            options:['次','晴','玩儿','虽然'], answer:'次',
            explanation:'次 is the measure word used to count how many times an action occurs.', source:'Vocabulary p.106'
          }),
          q('14-g-experience','grammar','choice','Choose the sentence meaning “I have been to China.”',{
            options:['我去过中国。','我去了过中国。','我过中国去。','我去中国着。'], answer:'我去过中国。',
            explanation:'Put 过 directly after the verb to mark past experience: 去过.', source:'Notes pp.108–109'
          }),
          q('14-g-negative','grammar','choice','Choose the natural negative experiential sentence.',{
            options:['我没有看过那个电影。','我不看过那个电影。','我看没有过那个电影。','我没有过看那个电影。'], answer:'我没有看过那个电影。',
            explanation:'Negate an experience with 没(有) before the verb; keep 过 after the verb.', source:'Notes pp.108–109'
          }),
          q('14-g-question','grammar','choice','Ask whether someone has ever bought things in this shop.',{
            options:['你在这个商店买过东西没有？','你在这个商店买东西过吗没有？','你有没有过在这个商店买东西？','你不买过这个商店东西吗？'], answer:'你在这个商店买过东西没有？',
            explanation:'Verb + 过 + object + 没有 is one valid experiential question pattern.', source:'14-4'
          }),
          q('14-g-contrast','grammar','choice','Choose the correctly paired contrast.',{
            options:['虽然天气很冷，但是他还去跑步。','虽然天气很冷，所以他还去跑步。','因为天气很冷，但是他还去跑步。','但是天气很冷，虽然他还去跑步。'], answer:'虽然天气很冷，但是他还去跑步。',
            explanation:'虽然 introduces the concession and 但是 introduces the contrasting result.', source:'Notes p.109'
          }),
          q('14-g-times','grammar','choice','Choose the correct sentence for “I have been to Beijing twice.”',{
            options:['我去过北京两次。','我两次过北京去。','我去两次过北京。','我过北京去两次。'], answer:'我去过北京两次。',
            explanation:'The frequency complement follows the verb phrase: 去过北京 + 两次.', source:'Notes p.110'
          }),
          q('14-p-order-experience','production','order','Build: “Have you seen that movie?”',{
            tokens:['吗','那个电影','你','看过'], answer:['你','看过','那个电影','吗'],
            explanation:'Use subject + Verb过 + object + 吗.', source:'14-1'
          }),
          q('14-p-order-contrast','production','order','Build: “Although it is sunny, it is very cold.”',{
            tokens:['但是','虽然','很冷','是晴天'], answer:['虽然','是晴天','但是','很冷'],
            explanation:'Keep the paired structure in order: 虽然 clause, then 但是 clause.', source:'14-3'
          }),
          q('14-p-write-negative','production','input','Write in Chinese: “I have not been to China.”',{
            accepted:['我没去过中国','我没去过中国。','我没有去过中国','我没有去过中国。'], answer:'我没有去过中国。',
            placeholder:'Type the complete sentence',
            explanation:'Use 没(有) + 去过 to deny the past experience.', source:'Notes pp.108–109'
          }),
          q('14-p-write-times','production','input','Complete with two characters: “我看过这个电影___。” (I have watched this movie three times.)',{
            accepted:['三次'], answer:'三次', placeholder:'Type two characters',
            explanation:'A number plus 次 states the number of occurrences.', source:'Notes p.110'
          })
        ]
      },
      {
        id: 'hsk2-15',
        number: 15,
        titleZh: '新年就要到了',
        titleEn: 'The New Year is coming',
        sourcePages: 'Textbook 113–120 · PDF 133–140',
        color: 'pink',
        vocabulary: [
          ['日','rì','day; date'], ['新年','xīnnián','New Year'],
          ['票','piào','ticket'], ['火车站','huǒchēzhàn','railway station'],
          ['大家','dàjiā','everyone'], ['更','gèng','even more; further'],
          ['妹妹','mèimei','younger sister'], ['阴','yīn','cloudy; overcast']
        ],
        objectives: [
          'Say that an action or event is about to happen',
          'Use 要、快要、快, and 就要 with sentence-final 了',
          'Use 就要……了 when a specific time phrase states when the event will occur',
          'Use 都……了 to emphasize that time or quantity is already considerable',
          'Understand travel, New Year, waiting, and weather conversations'
        ],
        reading: {
          title: '新年旅行',
          zh: '今天是十二月二十日，新年就要到了。我准备坐火车去北京旅游，明天就要去火车站买票了。妹妹还没来，都八点四十了，我们已经等了半个小时。天阴了，快要下雨了，希望她快一点儿。',
          sentences: [
            '今天是十二月二十日，新年就要到了。',
            '我准备坐火车去北京旅游，明天就要去火车站买票了。',
            '妹妹还没来，都八点四十了。',
            '我们已经等了半个小时。',
            '天阴了，快要下雨了，希望她快一点儿。'
          ],
          pinyin: 'Jīntiān shì shí’èryuè èrshí rì, xīnnián jiù yào dào le. Wǒ zhǔnbèi zuò huǒchē qù Běijīng lǚyóu, míngtiān jiù yào qù huǒchēzhàn mǎi piào le. Mèimei hái méi lái, dōu bā diǎn sìshí le, wǒmen yǐjīng děng le bàn ge xiǎoshí. Tiān yīn le, kuàiyào xià yǔ le, xīwàng tā kuài yìdiǎnr.',
          en: 'Today is December 20, and the New Year is approaching. I plan to travel to Beijing by train and will go to the station to buy a ticket tomorrow. My younger sister still has not arrived; it is already 8:40, and we have waited half an hour. The sky is cloudy and rain is coming, so I hope she hurries.',
          source: 'Adapted from dialogues 15-1–15-4'
        },
        summary: [
          '要/快要/快/就要 + action + 了 says that something is about to happen.',
          'When a specific time phrase is present, use 就要……了: 明天就要出发了.',
          '都 + time/quantity + 了 emphasizes that the amount is already considerable.',
          '更 before an adjective or verb expresses a further degree: 明年更好.'
        ],
        questions: [
          q('15-l-new-year','listening','choice','What is approaching?',{
            audio:'今天是十二月二十日，新年就要到了。', options:['The New Year','A train','A rainstorm','A birthday'], answer:'The New Year',
            explanation:'新年就要到了 explicitly says the New Year is coming soon.', source:'15-1'
          }),
          q('15-l-waiting','listening','choice','How long have they already waited?',{
            audio:'都等她半个小时了！', options:['Ten minutes','Twenty minutes','Half an hour','One hour'], answer:'Half an hour',
            explanation:'半个小时 means half an hour; 都……了 emphasizes that the wait is already long.', source:'15-3'
          }),
          q('15-l-rain','listening','choice','Why should the listener be careful on the way?',{
            audio:'天阴了，快要下雨了，你路上慢点儿。', options:['It is about to rain.','The bus has left.','The road is closed.','It is getting hot.'], answer:'It is about to rain.',
            explanation:'快要下雨了 means rain is about to begin.', source:'15-4'
          }),
          q('15-v-ticket','vocabulary','choice','What do you buy before taking a train?',{
            options:['票','日','阴','大家'], answer:'票',
            explanation:'票 means ticket; 火车票 is a train ticket.', source:'15-1'
          }),
          q('15-v-cloudy','vocabulary','choice','Which word describes an overcast sky?',{
            options:['阴','更','新年','妹妹'], answer:'阴',
            explanation:'阴 describes cloudy or overcast weather.', source:'15-4'
          }),
          q('15-g-imminent','grammar','choice','Choose the sentence saying the train is about to arrive.',{
            options:['火车快要到了。','火车到过了。','火车到着了。','火车都到吗。'], answer:'火车快要到了。',
            explanation:'快要 + verb + 了 presents the event as imminent.', source:'Notes pp.116–117'
          }),
          q('15-g-jiuyao','grammar','choice','Which sentence naturally means “The New Year is coming soon”?',{
            options:['新年就要到了。','新年就到了要。','新年要了到。','新年到了就要。'], answer:'新年就要到了。',
            explanation:'The chapter pattern is 就要 + verb + 了.', source:'15-1'
          }),
          q('15-g-time-phrase','grammar','choice','Choose the chapter pattern when a specific time phrase is present.',{
            options:['明天火车就要来了。','明天火车快要来了。','火车明天来了要。','明天要了火车来。'], answer:'明天火车就要来了。',
            explanation:'With a specific time adverbial such as 明天, the chapter uses 就要……了, not 快要……了.', source:'Notes p.117'
          }),
          q('15-g-dou-time','grammar','choice','Which sentence emphasizes that it is already very late?',{
            options:['都十二点了！','十二点都吗！','十二点要都了！','都要十二点吗！'], answer:'都十二点了！',
            explanation:'都 + time/quantity + 了 adds emphasis: it is already twelve o’clock.', source:'Notes p.117'
          }),
          q('15-g-dou-duration','grammar','choice','Choose the sentence meaning “We have already waited for her for half an hour.”',{
            options:['我们都等她半个小时了。','我们等都她半个小时。','我们半个小时都她等了。','我们要等她都半个小时。'], answer:'我们都等她半个小时了。',
            explanation:'都 before the verb phrase and sentence-final 了 emphasize the already considerable duration.', source:'15-3'
          }),
          q('15-p-order-rain','production','order','Build: “It is about to rain.”',{
            tokens:['下雨','了','快要'], answer:['快要','下雨','了'],
            explanation:'Use 快要 + action + 了 for an imminent event.', source:'15-4'
          }),
          q('15-p-order-wait','production','order','Build: “We have already waited for her for half an hour.”',{
            tokens:['半个小时','我们','她','都等','了'], answer:['我们','都等','她','半个小时','了'],
            explanation:'The order is subject + 都 + verb + object + duration + 了.', source:'15-3'
          }),
          q('15-p-write-new-year','production','input','Write in Chinese: “The New Year is coming soon.”',{
            accepted:['新年就要到了','新年就要到了。','新年快要到了','新年快要到了。','新年快到了','新年快到了。'], answer:'新年就要到了。',
            placeholder:'Type the complete sentence',
            explanation:'就要……了, 快要……了, and 快……了 can all present the event as near.', source:'Notes pp.116–117'
          }),
          q('15-p-write-already','production','input','Complete with one character: “___八点四十了！”',{
            accepted:['都'], answer:'都', placeholder:'Type one character',
            explanation:'都……了 emphasizes that the time has already reached eight forty.', source:'15-3'
          })
        ]
      }
    ]
  };
})();
