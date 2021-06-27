const webService = require('./webService');
const moment = require('moment');

const config = {
    reddit: {
        urlParams: '/top.json?limit=10&t=day',
        processor: ''
    },
    StackOverflow: {
        decompress: true
    },
    rss2js: {
        urlParams: '&api_key=uiphayubim2edvkrwyj0v5pduw2monjyylzklbvv'
    }
};

const getProviders = () => {
    return {
        1: {
            id: 1,
            root: 'rss2js',
            name: 'Hackernoon',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcdn.hackernoon.com%2Ffeed',
            thumbnail: 'https://hackernoon.com/hn-icon.png'
        },
        2: {
            id: 2,
            root: 'StackOverflow',
            name: 'Stack Overflow',
            url: 'https://api.stackexchange.com/2.2/questions?order=desc&sort=week&site=stackoverflow',
            thumbnail: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/icon-48.png'
        },
        3: {
            id: 3,
            root: 'HashNode',
            name: 'HashNode',
            url: 'https://api.hashnode.com/?query=%7BstoriesFeed%28type%3ABEST%29%7Btitle%2Cslug%2CresponseCount%2CcoverImage%2Cbrief%2CdateAdded%2Ccuid%2Cauthor%7Bname%2CblogHandle%2CpublicationDomain%7D%2CpartOfPublication%7D%7D',
            thumbnail: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png?auto=compress'
        },
        4: {
            id: 4,
            root: 'Devto',
            name: 'Dev.to',
            url: 'https://dev.to/api/articles',
            thumbnail: 'https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg'
        },
        5: {
            id: 5,
            root: 'reddit',
            name: 'Reddit: /r/learnprogramming',
            url: 'https://www.reddit.com/r/learnprogramming',
            thumbnail: 'https://styles.redditmedia.com/t5_2r0ij/styles/communityIcon_yor9myhxz5x11.png'
        },
        6: {
            id: 6,
            root: 'reddit',
            name: 'Reddit: /r/javascript',
            url: 'https://www.reddit.com/r/javascript',
            thumbnail: 'https://a.thumbs.redditmedia.com/zDOFJTXd6fmlD58VDGypiV94Leflz11woxmgbGY6p_4.png'
        },
        7: {
            id: 7,
            root: 'reddit',
            name: 'Reddit: /r/compsci',
            url: 'https://www.reddit.com/r/compsci',
            thumbnail: 'https://b.thumbs.redditmedia.com/rSQiXMQH6Hfx6JT93g5PfXJ1qubd7y9wJX6FmIsAHik.png'
        },
        8: {
            id: 8,
            root: 'reddit',
            name: 'Reddit: /r/coding',
            url: 'https://www.reddit.com/r/coding',
            thumbnail: 'https://styles.redditmedia.com/t5_2r0ij/styles/communityIcon_yor9myhxz5x11.png'
        },
        9: {
            id: 9,
            root: 'reddit',
            name: 'Reddit: /r/computerscience',
            url: 'https://www.reddit.com/r/computerscience',
            thumbnail: 'https://b.thumbs.redditmedia.com/1Tj5A-SF1Wd0b5TOOKVm145yG88HEIbBwjIT6utaDDc.png'
        },
        10: {
            id: 10,
            root: 'reddit',
            name: 'Reddit: /r/cscareerquestions',
            url: 'https://www.reddit.com/r/cscareerquestions',
            thumbnail: 'https://styles.redditmedia.com/t5_2sdpm/styles/communityIcon_u6zl61vcy9511.png?width=256&s=c175de99213f30466ec007fc18704a0414f97c9e'
        },
        11: {
            id: 11,
            root: 'reddit',
            name: 'Reddit: /r/csMajors',
            url: 'https://www.reddit.com/r/csMajors',
            thumbnail: 'https://styles.redditmedia.com/t5_2r0ij/styles/communityIcon_yor9myhxz5x11.png'
        },
        12: {
            id: 12,
            root: 'reddit',
            name: 'Reddit: /r/dailyprogrammer',
            url: 'https://www.reddit.com/r/dailyprogrammer',
            thumbnail: 'https://styles.redditmedia.com/t5_2r0ij/styles/communityIcon_yor9myhxz5x11.png'
        },
        13: {
            id: 13,
            root: 'reddit',
            name: 'Reddit: /r/django',
            url: 'https://www.reddit.com/r/django',
            thumbnail: 'https://styles.redditmedia.com/t5_2qh4v/styles/communityIcon_r1rcce3bp1241.png?width=256&s=62f749f07d90c1e726ca07cb65a6a1950a850f88'
        },
        14: {
            id: 14,
            root: 'reddit',
            name: 'Reddit: /r/flask',
            url: 'https://www.reddit.com/r/flask',
            thumbnail: 'https://styles.redditmedia.com/t5_2s1s3/styles/communityIcon_o4vkby94vkz41.png?width=256&s=906e421fba789f4e77bc93ea41e996a26c8c4645'
        },
        15: {
            id: 15,
            root: 'reddit',
            name: 'Reddit: /r/Frontend',
            url: 'https://www.reddit.com/r/Frontend',
            thumbnail: 'https://styles.redditmedia.com/t5_2r0ij/styles/communityIcon_yor9myhxz5x11.png'
        },
        16: {
            id: 16,
            root: 'reddit',
            name: 'Reddit: /r/learnjavascript',
            url: 'https://www.reddit.com/r/learnjavascript',
            thumbnail: 'https://styles.redditmedia.com/t5_2tugi/styles/communityIcon_7yzrvmem0wi31.png?width=256&s=d0110712c83415e5309f985c6d7dc19086f7d79d'
        },
        17: {
            id: 17,
            root: 'reddit',
            name: 'Reddit: /r/learnmath',
            url: 'https://www.reddit.com/r/learnmath',
            thumbnail: 'https://b.thumbs.redditmedia.com/Hd01s6azRT7UBALq_Yw_juehXj0ZkdjOYbXcLfK5iCQ.png'
        },
        18: {
            id: 18,
            root: 'reddit',
            name: 'Reddit: /r/learnpython',
            url: 'https://www.reddit.com/r/learnpython',
            thumbnail: 'https://styles.redditmedia.com/t5_2r8ot/styles/communityIcon_jwr5s7l5ici61.png?width=256&s=45deb6f123031525835c1ab234a53be00bdbc207'
        },
        19: {
            id: 19,
            root: 'reddit',
            name: 'Reddit: /r/PHP',
            url: 'https://www.reddit.com/r/PHP',
            thumbnail: 'https://styles.redditmedia.com/t5_2qh38/styles/communityIcon_62ypnf1gsv351.png?width=256&s=9d69219afd11310c252319655ae3da03f5de46bb'
        },
        20: {
            id: 20,
            root: 'reddit',
            name: 'Reddit: /r/programming',
            url: 'https://www.reddit.com/r/programming',
            thumbnail: 'https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png?width=256&s=45361614cdf4a306d5510b414d18c02603c7dd3c'
        },
        21: {
            id: 21,
            root: 'reddit',
            name: 'Reddit: /r/Python',
            url: 'https://www.reddit.com/r/Python',
            thumbnail: 'https://styles.redditmedia.com/t5_2qh0y/styles/communityIcon_h9cdwd9m75a51.png?width=256&s=d4d1eb25f0a6853d76836ca30184fc9a67a57464'
        },
        22: {
            id: 22,
            root: 'reddit',
            name: 'Reddit: /r/reactjs/',
            url: 'https://www.reddit.com/r/reactjs',
            thumbnail: 'https://styles.redditmedia.com/t5_2zldd/styles/communityIcon_fbblpo38vy941.png?width=256&s=13a87a036836ce95570a76feb53f27e61717ad1b'
        },
        23: {
            id: 23,
            root: 'rss2js',
            name: 'Daily Dev',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fdaily.dev%2Fblog%2Frss.xml',
            thumbnail: 'https://res.cloudinary.com/practicaldev/image/fetch/s--KCRN0Wuf--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/organization/profile_image/356/ceb8dc0f-a77b-4f89-84da-52216a4286e1.png'
        },
        24: {
            id: 24,
            root: 'rss2js',
            name: 'Martin Fowler',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmartinfowler.com%2Ffeed.atom',
            thumbnail: 'https://martinfowler.com/img/mf-dallas.jpg'
        },
        25: {
            id: 25,
            root: 'rss2js',
            name: 'Scott Hanselman',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.feedblitz.com%2Fscotthanselman',
            thumbnail: 'http://images.hanselman.com/main/photo-scott-tall.jpg'
        },
        26: {
            id: 26,
            root: 'rss2js',
            name: 'David Walsh',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fdavidwalsh.name%2Ffeed',
            thumbnail: 'https://davidwalsh.name/wp-content/themes/punky/images/logo.png'
        },
        27: {
            id: 27,
            root: 'rss2js',
            name: 'A List Apart',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Falistapart.com%2Fmain%2Ffeed%2F',
            thumbnail: 'https://alistapart.com/wp-content/uploads/2019/03/cropped-icon_navigation-laurel-512.jpg?fit=512%2C512'
        },
        28: {
            id: 28,
            root: 'rss2js',
            name: 'DZone',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.dzone.com%2Fhome',
            thumbnail: 'https://ilabs-jobhub.s3-us-west-2.amazonaws.com/jobs/BADEGm8AthDcq837sZxmO9Y4LMxfhQ8qxEIA1TCn.png'
        },
        29: {
            id: 29,
            root: 'rss2js',
            name: 'SD Times',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsdtimes.com%2Ffeed%2F',
            thumbnail: ''
        },
        30: {
            id: 30,
            root: 'rss2js',
            name: 'Developer.com',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.developer.com%2Ffeed%2F',
            thumbnail: 'https://devcomprd.wpengine.com/wp-content/uploads/2021/01/Dev_logo_Favicon.png'
        },
        31: {
            id: 31,
            root: 'rss2js',
            name: 'Scand',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fscand.com%2Fcompany%2Fblog%2Ffeed%2F',
            thumbnail: 'https://scand.com/wp-content/uploads/2020/04/cropped-fav-3-1-32x32.png'
        },
        32: {
            id: 32,
            root: 'rss2js',
            name: 'GeeksforGeeks',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.geeksforgeeks.org%2Ffeed%2F',
            thumbnail: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_favicon.png'
        },
        33: {
            id: 33,
            root: 'hackernews',
            name: 'Hacker News',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.ycombinator.com%2Frss',
            thumbnail: 'https://news.ycombinator.com/y18.gif'
        },
        34: {
            id: 34,
            root: 'rss2js',
            name: 'Google Developers Blog',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.feedburner.com%2FGDBcode',
            thumbnail: 'https://img-authors.flaticon.com/google.jpg'
        },
        35: {
            id: 35,
            root: 'rss2js',
            name: 'TechCrunch IT',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.feedburner.com%2FTechCrunchIT',
            thumbnail: 'https://spng.pngfind.com/pngs/s/340-3403096_file-techcrunch-logo-svg-techcrunch-logo-png-transparent.png'
        },
        36: {
            id: 36,
            root: 'rss2js',
            name: 'Stitcher IO',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fstitcher.io%2Frss',
            thumbnail: 'https://stitcher.io/resources/img/favicon/favicon-32x32.png'
        },
        37: {
            id: 37,
            root: 'rss2js',
            name: 'How to Geek',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.howtogeek.com%2Ffeed%2F',
            thumbnail: 'https://www.howtogeek.com/public/favicon.ico'
        },
    };
}

const getProviderById = (id) => {
    const providers = getProviders();
    return providers[id];
}

const processDescription = (description) => {
    let shortenedDesc = '';
    if (description && typeof description === 'string') {
        shortenedDesc = description.length > 255 ? `${description.substring(0, 255)} ...` : description;
    }
    return shortenedDesc;
}

const getProcessorFunction = (providerId) => {
    let uid = 0;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const provider = getProviderById(providerId);
    const functions = {
        'redditProcessor': function (data) {
            const posts = data.body.data.children;
            return posts.map(postData => {
                const post = postData.data;
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment.unix(post.created_utc).format(dateFormat),
                    link: post.url,
                    author: post.author,
                    description: processDescription(post.selftext),
                    tags: [],
                    thumbnail: provider.thumbnail,
                    image: null,
                    metadata: {comments: post.num_comments, upvotes: post.ups, downvotes: post.downs}
                }
            });
        },
        'rss2jsProcessor': function (data) {
            const posts = data.body.items ? data.body.items : [];
            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: post.pubDate,
                    link: post.link,
                    author: post.author,
                    description: processDescription(post.description),
                    tags: post.categories,
                    thumbnail: provider.thumbnail,
                    image: post.thumbnail,
                    metadata: {}
                }
            });
        },
        'StackOverflowProcessor': function (data) {
            const posts = data.body.items ? data.body.items : [];
            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment.unix(post.creation_date).utc().format(dateFormat),
                    link: post.link,
                    author: post.owner.display_name,
                    description: 'Read more on Stack Overflow ...',
                    tags: post.tags,
                    thumbnail: provider.thumbnail,
                    image: null,
                    metadata: {comments: post.answer_count, score: post.score, views: post.view_count}
                }
            });
        },
        'HashNodeProcessor': function (data) {
            const posts = data.body.data.storiesFeed ? data.body.data.storiesFeed : [];

            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment(post.dateAdded).format(dateFormat),
                    link: `https://${post.author.blogHandle}.hashnode.dev/${post.slug}`,
                    author: post.author.name,
                    description: processDescription(post.brief),
                    tags: [],
                    thumbnail: provider.thumbnail,
                    image: post.coverImage,
                    metadata: {comments: post.responseCount, score: post.totalReactions, views: post.view_count}
                }
            });
        },
        'DevtoProcessor': function (data) {
            const posts = data.body ? data.body : [];

            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment(post.published_timestamp).format(dateFormat),
                    link: post.url,
                    author: post.user.name,
                    description: processDescription(post.description),
                    tags: post.tag_list,
                    thumbnail: provider.thumbnail,
                    image: post.social_image,
                    metadata: {comments: post.comments_count, score: post.positive_reactions_count}
                }
            });
        },
        'hackernewsProcessor': function (data) {
            const posts = data.body.items ? data.body.items : [];
            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: post.pubDate,
                    link: post.link,
                    author: post.author,
                    description: '',
                    tags: post.categories,
                    thumbnail: provider.thumbnail,
                    image: post.thumbnail,
                    metadata: {}
                }
            });
        },
    }
    return functions[`${provider.root}Processor`];
}

const fetchPostsForProvider = async (providerId) => {
    const provider = getProviderById(providerId);
    let urlExtraParams = '';
    let decompress = false;
    if (config[provider.root]) {
        urlExtraParams = config[provider.root].urlParams ? `${config[provider.root].urlParams}` : '';
        decompress = config[provider.root].decompress;
    }
    const articleData = await webService.fetchData(`${provider.url}${urlExtraParams}`, decompress);
    return getProcessorFunction(provider.id)(articleData);
}

const providerStore = {
    fetchProviders: getProviders,
    fetchProviderPosts: fetchPostsForProvider
};

module.exports = providerStore;
