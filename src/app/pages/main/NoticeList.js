import "./NoticeList.css"
import { ToastContainer } from "react-toastify";
import Header from "../../components/common/header/Header.js"
import Sidebar from "../../components/common/sidebar/Sidebar.js"
import AddBlue from "../../../assets/images/addBlue.png"
import ArrowUp from "../../../assets/images/arrowUp.png"
import ArrowDown from "../../../assets/images/arrowDown.png"
import { useEffect, useState } from "react";
import Modal from "../../components/common/modal/Modal";
import NoticeAddModal from "../../components/main/notice/NoticeAddModal";
import NoticeAPI from "../../../apis/notice/Notice";
import Utils from "../../../features/utils/Utils";
import NonoToast from "../../components/common/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { clearNoticeItem, selectNotice, updateNotice } from "../../../features/main/NoticeSlice";
import PrimaryButton from "../../components/common/button/PrimaryButton";
import TextButton from "../../components/common/button/TextButton";
import NoticeContentsModal from "../../components/main/notice/NoticeContentsModal";
import Dialog from "../../components/common/modal/Dialog";
import { removeSearchValue, search } from "../../../features/main/SearchSlice";
import RoundButton from "../../components/common/button/RoundButton";

const NoticeList = () => {
    const [isOpenNoticeAddModal, updateOpenNoticeAddModal] = useState(false);
    const [isOpenNoticeEditModal, updateOpenNoticeEditModal] = useState(false);
    const [isOpenRemoveModal, updateOpenRemoveModal] = useState(false);
    const [currentSort, updatecurrentSort] = useState({ type: "createAt", order: "desc" });
    const [isLoading, updateLoading] = useState(false);
    const sort = [
        { type: "createAt", order: "asc" },
        { type: "createAt", order: "desc" },
    ]

    const dispatch = useDispatch();
    const selectedNoticeItem = useSelector((state) => state.notice.selectedItem);
    const noticeList = useSelector((state) => state.notice.itemList);
    const noticeMetaData = useSelector((state) => state.notice.metaData);
    const searchData = useSelector((state) => state.search.value);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken")
        if (accessToken === "" || accessToken === null) {
            window.location.replace("/login");
        } else {
            const fetchData = async () => {
                if (await Utils.checkToken()) {
                    dispatch(removeSearchValue());
                    dispatch(clearNoticeItem());
                    // await getNoticeList("");
                } else {
                    console.log("token expired");
                    NonoToast.error("????????? ??????????????? ?????????????????????.");
                    await Utils.timeout(2000);
                    window.location.replace("/login");
                }
            }
            fetchData();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getNoticeList(searchData);
        }
        fetchData();
    }, [searchData]);

    useEffect(() => {
        const fetchData = async () => {
            await getNoticeList(searchData, 1);
        }
        fetchData();
    }, [currentSort]);

    async function getNoticeList(query, page) {
        updateLoading(true);
        const response = await NoticeAPI.getNoticeList(currentSort.type, currentSort.order, query, page);
        if (response.isSuccess) {
            dispatch(updateNotice(response.data))
        } else {
            NonoToast.error("????????? ??????????????? ??????????????????. ?????? ???????????????.")
        }
        updateLoading(false);
    }

    const getSortString = () => {
        if (currentSort.type === "createAt") {
            return "????????????";
        } else if (currentSort.type === "updateAt") {
            return "????????????";
        } else {
            return "";
        }
    }

    const onClickItem = (noticeId) => {
        dispatch(selectNotice(noticeId));
    }

    const onClickNoticeAddButton = () => {
        updateOpenNoticeAddModal(true)
    }

    const onCloseNoticeAddModal = () => {
        updateOpenNoticeAddModal(false);
        getNoticeList(searchData);
    }

    const onClickEditButton = () => {
        updateOpenNoticeEditModal(true);
    }

    const onCloseOpenNoticeEditModal = () => {
        updateOpenNoticeEditModal(false);
        getNoticeList(searchData);
    }

    const onClickRemoveNoticeModal = () => {
        updateOpenRemoveModal(true);
    }

    const onCloseRemoveNoticeModal = () => {
        updateOpenRemoveModal(false);
    }

    const onScrollNoticeList = (event) => {
        const scrollY = event.target.scrollTop;
        console.log(scrollY);

        if (scrollY >= 40 * noticeMetaData.page) {
            console.log(noticeMetaData.lastPage);
            if (!noticeMetaData.lastPage && !isLoading) {
                getNoticeList(searchData, (noticeMetaData.page + 1));
            }
        }
    }

    const confirmRemoveNoticeDialog = async () => {
        console.log(selectedNoticeItem);
        const response = await NoticeAPI.removeNotice(selectedNoticeItem.noticeId);
        if (response.isSuccess) {
            NonoToast.success("??????????????? ??????????????????.");
            updateOpenRemoveModal(false);
            await Utils.timeout(1000);
            window.location.reload();
        } else {
            NonoToast.error(response.errorMessage ?? "???????????? ????????? ??????????????????.");
            updateOpenRemoveModal(false);
            window.location.reload();
        }
    }

    const onCLickSortButton = () => {
        if(currentSort.order === "desc") {
        updatecurrentSort({ type: "createAt", order: "asc" });
        } else {
            updatecurrentSort({ type: "createAt", order: "desc" });
        }
    }

    return (
        <div>
            <ToastContainer />
            <Modal isOpen={isOpenNoticeAddModal}>
                <NoticeAddModal onClickClose={onCloseNoticeAddModal} />
            </Modal>
            <Modal isOpen={isOpenNoticeEditModal}>
                <NoticeContentsModal
                    onClickClose={onCloseOpenNoticeEditModal}
                    isReadOnly={false}
                />
            </Modal>
            <Modal isOpen={isOpenRemoveModal} >
                <Dialog title="???????????? ??????"
                    contents="?????? ??????????????? ?????????????????????????"
                    warning={true}
                    onCancel={onCloseRemoveNoticeModal}
                    confirm={confirmRemoveNoticeDialog} />
            </Modal>
            <div className="page">
                <Sidebar value="/notice/list" />
                <div className="contentsPage">
                    <Header title="???????????? ??????"
                        desc="??????????????? ????????? ??? ?????????!"
                        isSearch={true} />
                    <div className="pageBody">
                        {
                            (noticeList.length === 0 && searchData === "") ?
                                <div className="emptyNoticeContentsPage">
                                    <p>????????? ??????????????? ????????? ?????????!</p>
                                    <div className="emptyListAddNoticeButton">
                                        <RoundButton onClick={onClickNoticeAddButton} value="????????????" />
                                    </div>
                                </div>
                                :

                                <div className="noticeListPage">
                                    <div className="listSection">
                                        <div className="topButtonSection">
                                            <div className="emptySection" />
                                            <div className="noticeSortButton" onClick={onCLickSortButton}>
                                                <span>{getSortString()}</span>
                                                <img src={currentSort.order === "asc" ? ArrowUp : ArrowDown} />
                                            </div>
                                        </div>
                                        <div className="noticeListContentsSection" onScroll={onScrollNoticeList}>
                                            {
                                                (noticeList.length === 0 && searchData !== "") ?
                                                    <div className="emptyNoticeListContents">
                                                        <p>?????? ????????? ???????????? ????????????.</p>
                                                    </div>
                                                    :
                                                    <ul>
                                                        {
                                                            noticeList.map((item, index) => {
                                                                const createdAt = new Date(item.createdAt)
                                                                return (
                                                                    <li key={"noticeList" + item.noticeId + index}
                                                                    className={item.noticeId === selectedNoticeItem.noticeId ? "selectedNoticeListContentsSectionItem" : "noticeListContentsSectionItem"}
                                                                        onClick={() => onClickItem(item.noticeId)}
                                                                        >
                                                                        <div className="noticeItemTitle">
                                                                            <span >{item.title}</span>
                                                                        </div>
                                                                        <div className="noticeItemInfo">
                                                                            <span>{item.writer}</span>
                                                                            <span>{createdAt.toDateString()}</span>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })
                                                        }
                                                    </ul>
                                            }
                                        </div>
                                    </div>
                                    <div className="contentsSection">
                                        <div className="topButtonSection">
                                            <div className="emptySection" />
                                            <img src={AddBlue} alt="add"
                                                className="noticeAddButton"
                                                onClick={onClickNoticeAddButton} />
                                        </div>
                                        {
                                            selectedNoticeItem.title === undefined ?
                                                <div className="emptyNoticeContents">
                                                    <p>??????????????? ????????? ?????????.</p>
                                                </div>
                                                :
                                                <div className="noticeContentSection">
                                                    <div className="noticeContentsTitle">
                                                        <div className="noticeContentsTitleString">
                                                            <span>{selectedNoticeItem.title}</span>
                                                        </div>
                                                        <div className="noticeContentsTitleInfo">
                                                            <span className="noticeWriter">{selectedNoticeItem.writer}</span>
                                                            <span className="notiewCreateAt">{(new Date(selectedNoticeItem.createdAt)).toDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="noticeContentsBody">
                                                        <pre>{selectedNoticeItem.content}</pre>
                                                    </div>
                                                    <div className="noticeContentsTail">
                                                        <TextButton value="???????????? ??????"
                                                            warning={true}
                                                            onclick={onClickRemoveNoticeModal} />

                                                        <div className="noticeEditButton">
                                                            <PrimaryButton value="????????????" onClick={onClickEditButton} />
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticeList;