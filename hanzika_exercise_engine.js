(function(){
  'use strict';

  const HISTORY_PREFIX='hanzika_exercise_set_v1';

  function shuffled(items){
    const copy=items.slice();
    for(let index=copy.length-1;index>0;index--){
      const swap=Math.floor(Math.random()*(index+1));
      [copy[index],copy[swap]]=[copy[swap],copy[index]];
    }
    return copy;
  }

  function unique(items){ return [...new Set(items)]; }

  function interpolate(value,slots){
    if(typeof value==='string'){
      return value.replace(/\{\{([\w-]+)\}\}/g,(_,key)=>String(slots[key]??''));
    }
    if(Array.isArray(value)) return value.map(item=>interpolate(item,slots));
    return value;
  }

  function answerText(answer){
    return Array.isArray(answer)?answer.join('|'):String(answer??'');
  }

  function signature(question){
    return [question.skill,question.type,question.prompt,question.stem||'',answerText(question.answer)].join('\u241f');
  }

  function validQuestion(question){
    if(!question.id||!question.skill||!question.type||!question.prompt) return false;
    if(question.type==='choice'){
      return Array.isArray(question.options)&&question.options.length>=2&&
        unique(question.options).length===question.options.length&&question.options.includes(question.answer);
    }
    if(question.type==='order'){
      return Array.isArray(question.tokens)&&question.tokens.length>=2&&
        Array.isArray(question.answer)&&question.answer.length===question.tokens.length;
    }
    return typeof question.answer==='string'&&question.answer.length>0;
  }

  function prepareQuestion(question){
    const prepared={...question};
    if(Array.isArray(question.options)) prepared.options=shuffled(question.options);
    if(Array.isArray(question.tokens)) prepared.tokens=shuffled(question.tokens);
    prepared.exerciseSignature=signature(prepared);
    return prepared;
  }

  function inferredDifficulty(question){
    if(Number.isFinite(question.difficulty)) return question.difficulty;
    if(question.type==='input') return 3;
    if(question.type==='order'||question.skill==='listening') return 2;
    if(question.skill==='grammar') return 2;
    return 1;
  }

  function distractors(entries,current,field){
    return shuffled(entries.filter(entry=>entry!==current)).slice(0,3).map(entry=>entry[field]);
  }

  function vocabularyQuestions(chapter){
    const entries=(chapter.vocabulary||[]).map(([hanzi,pinyin,meaning])=>({hanzi,pinyin,meaning}));
    if(entries.length<4) return [];
    const generated=[];
    entries.forEach((entry,index)=>{
      const otherEntries=entries.filter(item=>item!==entry);
      generated.push({
        id:`gen:${chapter.id}:vocab-hanzi:${index}`,
        skill:'vocabulary',type:'choice',difficulty:1,generated:true,
        prompt:`Which chapter word means “${entry.meaning}”?`,
        options:unique([entry.hanzi,...distractors(otherEntries,null,'hanzi')]),answer:entry.hanzi,
        explanation:`${entry.hanzi} (${entry.pinyin}) means “${entry.meaning}.”`,
        source:'Generated locally from chapter vocabulary'
      });
      generated.push({
        id:`gen:${chapter.id}:vocab-meaning:${index}`,
        skill:'vocabulary',type:'choice',difficulty:1,generated:true,
        prompt:`What does ${entry.hanzi} (${entry.pinyin}) mean?`,
        options:unique([entry.meaning,...distractors(otherEntries,null,'meaning')]),answer:entry.meaning,
        explanation:`${entry.hanzi} (${entry.pinyin}) means “${entry.meaning}.”`,
        source:'Generated locally from chapter vocabulary'
      });
      generated.push({
        id:`gen:${chapter.id}:vocab-production:${index}`,
        skill:'production',type:'input',difficulty:2,generated:true,
        prompt:`Write the Chinese chapter word for “${entry.meaning}.”`,
        accepted:[entry.hanzi],answer:entry.hanzi,placeholder:'Type the Chinese word',
        explanation:`The chapter word is ${entry.hanzi} (${entry.pinyin}).`,
        source:'Generated locally from chapter vocabulary'
      });
    });
    return generated;
  }

  function clozeQuestions(chapter){
    const entries=(chapter.vocabulary||[]).map(([hanzi,pinyin,meaning])=>({hanzi,pinyin,meaning}));
    if(entries.length<4) return [];
    const sentences=chapter.reading?.sentences||[];
    return sentences.map((sentence,index)=>{
      const matches=entries.filter(entry=>sentence.includes(entry.hanzi))
        .sort((a,b)=>b.hanzi.length-a.hanzi.length);
      const entry=matches[0];
      if(!entry) return null;
      const alternatives=shuffled(entries.filter(item=>item!==entry)).slice(0,3);
      return {
        id:`gen:${chapter.id}:reading-cloze:${index}`,
        skill:'vocabulary',type:'choice',difficulty:2,generated:true,
        prompt:'Choose the chapter word that completes this sentence.',
        stem:sentence.replace(entry.hanzi,'___'),
        options:unique([entry.hanzi,...alternatives.map(item=>item.hanzi)]),answer:entry.hanzi,
        explanation:`The original chapter sentence uses ${entry.hanzi} (${entry.pinyin}), “${entry.meaning}.”`,
        source:chapter.reading?.source||'Generated locally from chapter reading'
      };
    }).filter(Boolean);
  }

  function orderRecognitionQuestions(chapter){
    return (chapter.questions||[]).filter(question=>question.type==='order').map((question,index)=>{
      const correct=question.answer.join('');
      const variants=[];
      const reversed=question.answer.slice().reverse();
      const rotated=question.answer.slice(1).concat(question.answer[0]);
      const swapped=question.answer.slice();
      [swapped[0],swapped[1]]=[swapped[1],swapped[0]];
      [reversed,rotated,swapped].forEach(parts=>variants.push(parts.join('')));
      const options=unique([correct,...variants]).slice(0,4);
      if(options.length<3) return null;
      return {
        id:`gen:${chapter.id}:order-recognition:${index}`,
        skill:'grammar',type:'choice',difficulty:2,generated:true,
        prompt:'Which sentence keeps the chapter pattern in the correct order?',
        options,answer:correct,explanation:question.explanation,
        source:`Generated locally from ${question.source||'an authored production problem'}`
      };
    }).filter(Boolean);
  }

  function templateQuestions(chapter){
    const registry=window.HSK_EXERCISE_PATTERNS||{};
    const templates=[...(registry[chapter.id]||[]),...(chapter.exerciseTemplates||[])];
    const generated=[];
    templates.forEach(template=>{
      (template.cases||[]).forEach((slots,index)=>{
        const question={
          id:`gen:${chapter.id}:template:${template.id}:${index}`,
          skill:template.skill,type:template.type,difficulty:template.difficulty||2,generated:true,
          prompt:interpolate(template.prompt,slots),
          explanation:interpolate(template.explanation,slots),
          source:template.source||'Generated locally from an authored chapter pattern'
        };
        ['stem','options','answer','accepted','tokens','placeholder','audio'].forEach(field=>{
          if(template[field]!==undefined) question[field]=interpolate(template[field],slots);
        });
        generated.push(question);
      });
    });
    return generated;
  }

  function candidatesFor(chapter,test){
    const authored=(chapter.questions||[]).map(question=>({...question,generated:false}));
    const all=[
      ...authored,
      ...vocabularyQuestions(chapter),
      ...clozeQuestions(chapter),
      ...orderRecognitionQuestions(chapter),
      ...templateQuestions(chapter)
    ].filter(validQuestion).map(question=>({...question,difficulty:inferredDifficulty(question)}));
    const seen=new Set();
    return all.filter(question=>{
      const key=signature(question);
      if(seen.has(key)||!test.skills.includes(question.skill)) return false;
      seen.add(key);
      return question.difficulty<=(test.difficulty||3);
    });
  }

  function historyKey(chapter,test){ return `${HISTORY_PREFIX}:${chapter.id}:${test.id}`; }
  function previousSignatures(chapter,test){
    try {
      const stored=JSON.parse(localStorage.getItem(historyKey(chapter,test))||'[]');
      return new Set(Array.isArray(stored)?stored:[]);
    } catch(_){ return new Set(); }
  }
  function remember(chapter,test,questions){
    try {
      localStorage.setItem(historyKey(chapter,test),JSON.stringify(questions.map(signature)));
    } catch(_){}
  }

  function ranked(items,targetDifficulty){
    return shuffled(items).sort((a,b)=>{
      const aDistance=Math.abs(targetDifficulty-a.difficulty);
      const bDistance=Math.abs(targetDifficulty-b.difficulty);
      return aDistance-bDistance;
    });
  }

  function chooseSet(chapter,test){
    const candidates=candidatesFor(chapter,test);
    const count=Math.min(test.count,candidates.length);
    const previous=previousSignatures(chapter,test);
    const fresh=candidates.filter(question=>!previous.has(signature(question)));
    const used=new Set();
    const selected=[];
    const target=test.difficulty||3;
    const take=question=>{
      const key=signature(question);
      if(selected.length>=count||used.has(key)) return;
      used.add(key); selected.push(question);
    };
    const mix=test.mix||{};
    Object.entries(mix).forEach(([skill,amount])=>{
      const before=selected.length;
      ranked(fresh.filter(question=>question.skill===skill),target).forEach(question=>{
        if(selected.length-before<amount) take(question);
      });
      if(selected.length-before<amount){
        ranked(candidates.filter(question=>question.skill===skill),target).forEach(question=>{
          if(selected.length-before<amount) take(question);
        });
      }
    });
    ranked(fresh,target).forEach(take);
    if(selected.length<count) ranked(candidates,target).forEach(take);
    const prepared=shuffled(selected).map(prepareQuestion);
    remember(chapter,test,prepared);
    return prepared;
  }

  window.HanzikaExerciseEngine={
    generateTest:chooseSet,
    poolSize:(chapter,test)=>candidatesFor(chapter,test).length,
    preview:(chapter,test)=>candidatesFor(chapter,test).map(prepareQuestion)
  };
})();
