import Instance from "./NoticeInstance";

// Notice 생성(post)
async function NoticePost(title, contents) {
  try {
    const response = await Instance.post("/api/v1/notice", {
      title: title,
      content: contents,
      onFocused: false,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Notice 조회(get)
export const NoticeGet = async () => {
  try {
    const response = await Instance.get("/api/v1/notice");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Notice 수정(put)
// export const NoticePut = async () => {
async function NoticePut(title, contents, noticeId) {
  try {
    const response = await Instance.put(`/api/v1/notice/${noticeId}`, {
      id: noticeId,
      title: title,
      content: contents,
      onFocused: false,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Notice 삭제(delete)
// export const NoticeDelete = async () => {
async function NoticeDelete(title, contents, noticeId) {
  try {
    const response = await Instance.delete(`/api/v1/notice/id=${noticeId}`, {
      id: noticeId,
      title: title,
      content: contents,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// 여러 함수를 하나의 변수로 통합 후 export
export const NoticeMethod = {
  NoticePost,
  NoticeGet,
  NoticePut,
  NoticeDelete,
};

export default NoticeMethod;
