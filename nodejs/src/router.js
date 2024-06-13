import pk_push from './spider/video/push.js';
import douban from './spider/video/douban.js';
import aiyingshi from './spider/video/aiyingshi.js';
import boo from './spider/video/boo.js';
import xinshijue from './spider/video/xinshijue.js';
import appys from './spider/video/appys.js';
import vcm3u8 from './spider/video/vcm3u8.js';
import live from './spider/video/live.js';
import cntv from './spider/video/cntv.js';
import saohuo from './spider/video/saohuo.js';
import nongmin from './spider/video/nongmin.js';
import czzy from './spider/video/czzy.js';
import sharenice from './spider/video/sharenice.js';
import ktv from './spider/video/ktv.js';
import yingso from './spider/video/yingso.js';
import avlive from './spider/video/avlive.js';
import maiyoux from './spider/video/maiyoux_node.js';
import avm3u8 from './spider/video/avm3u8.js';
import _13bqg from './spider/book/13bqg.js';
import bookan from './spider/book/bookan.js';
import ts230 from './spider/book/230ts.js';
import bengou from './spider/book/bengou.js';
import laobaigs from './spider/book/laobaigs.js';
import coco from './spider/book/coco.js';
import baozi from './spider/book/baozi.js';
import tewx from './spider/book/tewx.js';
import copymanga from './spider/book/copymanga.js';
import hm from './spider/book/韩漫基地.js';
import mhdq from './spider/book/mhdq.js';
import alist from './spider/pan/alist.js';

const spiders = [pk_push,douban,aiyingshi,xinshijue,appys,vcm3u8,live,cntv,saohuo,nongmin,czzy,sharenice,ktv,yingso,avlive,maiyoux,avm3u8,_13bqg,bookan,ts230,bengou,laobaigs,coco,baozi,tewx,copymanga,hm,mhdq];
/*
const spiders = [douban,nongmin,appys,vcm3u8,live,cntv,saohuo,tudou,kkys,czzy,ikanbot,sharenice,ktv,ttkx,meijumi,yingso,_13bqg,bookan,bengou,laobaigs,coco,copymanga];
*/
const spiderPrefix = '/spider';

/**
 * A function to initialize the router.
 *
 * @param {Object} fastify - The Fastify instance
 * @return {Promise<void>} - A Promise that resolves when the router is initialized
 */
export default async function router(fastify) {
    // register all spider router
    spiders.forEach((spider) => {
        const path = spiderPrefix + '/' + spider.meta.key + '/' + spider.meta.type;
        fastify.register(spider.api, { prefix: path });
        console.log('Register spider: ' + path);
    });
    /**
     * @api {get} /check 检查
     */
    fastify.register(
        /**
         *
         * @param {import('fastify').FastifyInstance} fastify
         */
        async (fastify) => {
            fastify.get(
                '/check',
                /**
                 * check api alive or not
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    reply.send({ run: !fastify.stop });
                }
            );
            fastify.get(
                '/config',
                /**
                 * get catopen format config
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    const config = {
                        video: {
                            sites: [],
                        },
                        read: {
                            sites: [],
                        },
                        comic: {
                            sites: [],
                        },
                        music: {
                            sites: [],
                        },
                        pan: {
                            sites: [],
                        },
                        color: fastify.config.color || [],
                    };
                    spiders.forEach((spider) => {
                        let meta = Object.assign({}, spider.meta);
                        meta.api = spiderPrefix + '/' + meta.key + '/' + meta.type;
                        meta.key = 'nodejs_' + meta.key;
                        const stype = spider.meta.type;
                        if (stype < 10) {
                            config.video.sites.push(meta);
                        } else if (stype >= 10 && stype < 20) {
                            config.read.sites.push(meta);
                        } else if (stype >= 20 && stype < 30) {
                            config.comic.sites.push(meta);
                        } else if (stype >= 30 && stype < 40) {
                            config.music.sites.push(meta);
                        } else if (stype >= 40 && stype < 50) {
                            config.pan.sites.push(meta);
                        }
                    });
                    reply.send(config);
                }
            );
        }
    );
}
