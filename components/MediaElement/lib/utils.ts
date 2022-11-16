// @ts-nocheck
const DOMAIN = "menosmalo.com";

export const findMediaInfo = async (post, quick = false, domain=DOMAIN) => {
  let videoInfo; // = { url: "", height: 0, width: 0 };
  let imageInfo; // = [{ url: "", height: 0, width: 0 }];
  let thumbnailInfo;
  let iFrameHTML;
  let gallery; // = [];
  let isPortrait = undefined as unknown as boolean;
  let isImage = false;
  let isGallery = false;
  let isVideo = false;
  let isLink = true;
  let isSelf = false; //self text post
  let isTweet = false;
  let isIframe = false;
  let isMedia = false; 

  let dimensions = [0, 0]; //x,y pixels

  const loadInfo = async (post, quick = false) => {
    let a = await findVideo(post);
    if (a) {
      isVideo = true;
      dimensions[0] = videoInfo.width;
      dimensions[1] = videoInfo.height;
    } else {
      let b = await findImage(post, quick);
      if (b) {
        //isImage = true;
        if (gallery?.[0]?.height > 0) {
          isImage = true;
          //just setting dimensions to first gallery image for now
          dimensions[0] = gallery[0].width;
          dimensions[1] = gallery[0].height;
        } else if (imageInfo) {
          //last item would be highest resolution
          if (
            post?.domain?.includes("redd.it") ||
            post?.domain?.includes("imgur")
          ) {
            isImage = true;
          }
          dimensions[0] = imageInfo[imageInfo.length - 1].width;
          dimensions[1] = imageInfo[imageInfo.length - 1].height;
        }
      }
    }

    if (!quick) {
      let i = await findIframe(post);
      if (i) {
        isIframe = true;
        isMedia = true; 
      }
    }

    if (
      post.thumbnail === "self" ||
      post.is_self ||
      post?.domain?.includes("self") || 
      post?.selftext_html
    ) {
      isSelf = true;
    }
    if (
      post?.domain?.includes("redd.it") ||
      post?.domain?.includes("reddit") ||
      post?.domain?.includes("self.") ||
      post?.url?.includes("imgur") ||
      isVideo
    ) {
      isLink = false;
    }

    //portrait && media check
    if (dimensions[0] > 0) {
      isMedia = true; 
      if (dimensions[1] >= dimensions[0]) {
        isPortrait = true;
      } else if (dimensions[1] < dimensions[0]) {
        isPortrait = false;
      }
    }

    //treat these as self posts, not images/videos/links or anything else
    if (isSelf) {
      isImage = false;
      isVideo = false;
      isGallery = false;
      isLink = false;
      isPortrait = false;
      isMedia = false; 
    }

    return {
      videoInfo,
      imageInfo,
      thumbnailInfo,
      iFrameHTML,
      gallery,
      isPortrait,
      isImage,
      isGallery,
      isVideo,
      isTweet,
      isIframe,
      isLink,
      isSelf,
      dimensions,
      isMedia
    };
  };

  const checkURL = (url) => {
    const placeholder =
      "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"; //"http://goo.gl/ijai22";
    if (!url?.includes("https://")) return placeholder;
    return url;
  };

  const findGfy = async (id, post) => {
    let req = await fetch(`https://api.gfycat.com/v1/gfycats/${id}`);
    if (req?.ok) {
      let data = await req.json();
      videoInfo = {
        url: data["gfyItem"]["mp4Url"],
        height: data["gfyItem"]["height"],
        width: data["gfyItem"]["width"],
        hasAudio: data["gfyItem"]["hasAudio"],
      };
      findImage(post);
      isVideo = true;
      return true;
    } else {
      findVideo(post, true);
    }
  };

  const findVideo = async (post, skipGfy = false) => {
    // console.log("find vid", post?.title);
    if (
      post?.url_overridden_by_dest?.includes("https://gfycat.com") &&
      post?.url_overridden_by_dest?.split("/")?.[3] &&
      !skipGfy
    ) {
      let res = await findGfy(
        post?.url_overridden_by_dest?.split("/")?.[3],
        post
      );
      return res;
    }
    if (post.preview) {
      if (post.preview.reddit_video_preview) {
        videoInfo = {
          url: checkURL(post.preview.reddit_video_preview.fallback_url),
          height: post.preview.reddit_video_preview.height,
          width: post.preview.reddit_video_preview.width,
        };

        thumbnailInfo = [
          {
            url: checkURL(post?.thumbnail),
            height: post.preview.reddit_video_preview.height,
            width: post.preview.reddit_video_preview.width,
          },
        ];
        await findImage(post, true);
        isVideo = true;
        return true;
        //setLoaded(true);
      }
      //gifs are stored as mp4s here, also with resolutions but just using source for now
      else if (post?.preview?.images?.[0]?.variants?.mp4) {
        videoInfo = {
          url: checkURL(post?.preview?.images?.[0]?.variants?.mp4?.source?.url),
          height: post?.preview?.images?.[0]?.variants?.mp4?.source?.height,
          width: post?.preview?.images?.[0]?.variants?.mp4?.source?.width,
        };

        thumbnailInfo = [
          {
            url: checkURL(post?.preview?.images?.[0]?.source?.url),
            height: post?.preview?.images?.[0]?.source?.height,
            width: post?.preview?.images?.[0]?.source?.width,
          },
        ];
        await findImage(post, true);
        isVideo = true;
        return true;
      }
    }
    if (post.media) {
      if (post.media.reddit_video) {
        videoInfo = {
          url: checkURL(post.media.reddit_video.fallback_url),
          height: post.media.reddit_video.height,
          width: post.media.reddit_video.width,
        };
        thumbnailInfo = [
          {
            url: checkURL(post?.thumbnail),
            height: post.media.reddit_video.height,
            width: post.media.reddit_video.width,
          },
        ];
        await findImage(post, true);
        isVideo = true;
        return true;
      }
    }

    return false;
  };

  const findImage = async (post, quick = false) => {
    if (post?.url?.includes("twitter.com")) {
      isTweet = true;
      //return true;
    }
    if (post.media_metadata) {
      gallery = [];
      //gallery_data is array of ordered gallery images but may not exist, media_metadata is object, not necessarily ordered
      for (let i in post?.gallery_data?.items ?? post.media_metadata) {
        let image = post?.media_metadata?.[i];
        let caption = post?.gallery_data?.items?.[i]?.caption ?? "";
        let id = post?.gallery_data?.items?.[i]?.media_id;
        if (id && post.media_metadata[id]) {
          image = post.media_metadata[id];
        }
        if (image.p) {
          if (image.p.length > 0) {
            let num = image.p.length - 1;
            //console.log(num);
            gallery.push({
              url: checkURL(
                image?.s?.gif ?? image.p[num].u.replace("amp;", "")
              ),
              height: image.p[num].y,
              width: image.p[num].x,
              caption: caption
            });
          }
        }
      }
      isGallery = true;
      //isImage = true;
      return true;
    } else if (post.preview) {
      //images
      if (post.preview.images[0]) {
        if (post.preview.images[0].resolutions.length > 0) {
          imageInfo = [];
          for (let i in post.preview.images[0].resolutions) {
            imageInfo.push({
              url: checkURL(
                post.preview?.images[0]?.resolutions[i].url.replace("amp;", "")
              ),
              height: post.preview?.images[0]?.resolutions[i].height,
              width: post.preview?.images[0]?.resolutions[i].width,
            });
          }
          if (post.preview.images[0].source) {
            imageInfo.push({
              url: checkURL(
                post.preview.images[0].source.url.replace("amp;", "")
              ),
              height: post.preview.images[0].source?.height,
              width: post.preview.images[0].source?.width,
            });
          }
          //isImage = true;
          return true;
        }
      }
    } else if (post.url) {
      let purl: string = post.url;
      if (
        purl.includes(".jpg") ||
        purl.includes(".png") ||
        purl.includes(".gif") //gifs should be handled in findVideo with mp4 format
      ) {
        if (!quick) {
          let info = await loadImg(purl);
          imageInfo = info;
        }

        //isImage = true;
        return true;
      }
    }
    return false;
  };
  const loadImg = async (purl) => {
    let dim: any = await addImageProcess(purl);

    return [
      {
        url: checkURL(purl),
        height: dim?.naturalHeight ?? 1080,
        width: dim?.naturalWidth ?? 1080,
      },
    ];
  };
  const addImageProcess = (src) => {
    return new Promise((resolve, reject) => {
      let img = document.createElement("img");
      img.onload = () =>
        resolve({
          naturalHeight: img.naturalHeight,
          naturalWidth: img.naturalWidth,
        });
      img.onerror = reject;
      img.src = src;
    });
  };
  const stringToHTML = function (str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    return doc.body.firstElementChild as Element;
  };

  const findIframe = async (post) => {
    if (post?.media_embed?.content) {
      if (post.media_embed.content.includes("iframe")) {
        let html: Element = stringToHTML(post.media_embed.content);
        html.setAttribute("height", "100%");
        html.setAttribute("width", "100%");
        let htmlsrc = html.getAttribute("src");
        if (htmlsrc?.includes("clips.twitch.tv")) {
          html.setAttribute(
            "src",
            `https://clips.twitch.tv/embed?clip=${
              post?.url.split("/")?.[3]
            }&parent=${domain}`
          );
        } 
        iFrameHTML = html;
        return true;
      }
    }
    return false;
  };

  return loadInfo(post?.crosspost_parent_list?.[0] ?? post, quick);
};

