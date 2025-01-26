
import { Jieba } from '@node-rs/jieba';
import { dict } from '@node-rs/jieba/dict'

const jieba = Jieba.withDict(dict)
console.log("start new jieba",jieba)

Object.freeze(jieba)

export default jieba;
