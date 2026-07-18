type VideoPlayerProps = {
  url: string;
  title: string;
};

function toEmbedUrl(raw: string) {
  try {
    const url = new URL(raw);

    if (url.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (url.pathname.startsWith("/embed/")) return raw;
    }

    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return raw;
  } catch {
    return raw;
  }
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const embedUrl = toEmbedUrl(url);
  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(embedUrl);

  if (isDirectVideo) {
    return (
      <video className="video-frame" controls preload="metadata">
        <source src={embedUrl} />
        当前浏览器无法播放该视频。
      </video>
    );
  }

  return (
    <div className="video-shell">
      <iframe
        className="video-frame"
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
