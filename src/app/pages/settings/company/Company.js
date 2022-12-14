import "./Company.css"

import { ToastContainer } from "react-toastify"
import Sort from "../../../../assets/images/sorting.png"
import AddBlue from "../../../../assets/images/addBlue.png"
import Delete from "../../../../assets/images/delete.png"
import Edit from "../../../../assets/images/edit.png"
import SideBar from "../../../components/common/sidebar/Sidebar"
import Header from "../../../components/common/header/Header"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearCompanyList, clearSelectedCompany, selectedCompany, updateCompanyItem, updateCompanyList } from "../../../../features/settings/companySlice"
import CompanyAPI from "../../../../apis/company/company"
import Utils from "../../../../features/utils/Utils"
import { removeSearchValue } from "../../../../features/main/SearchSlice"
import NonoToast from "../../../components/common/toast/Toast"
import Modal from "../../../components/common/modal/Modal"
import CompanyDeleteModal from "../../../components/settings/company/CompanyDeleteModal"
import CompanyNewModal from "../../../components/settings/company/CompanyNewModal"
import CompanyEditModal from "../../../components/settings/company/CompanyEditModal"


const Company = () => {
    const [isLoading, updateLoading] = useState(false);
    const [isOpenCompanyDeleteItem, updateOpenCompanyDeleteItem] = useState(false);
    const [isOpenCompanyNew, updateOpenCompanyNew] = useState(false);
    const [isOpenCpmpanyEdit, updateOpenCompanyEdit] = useState(false);
    const dispatch = useDispatch();
    const companyMetaData = useSelector((state) => state.company.metaData);
    const companyList = useSelector((state) => state.company.itemList);
    const searchData = useSelector((state) => state.search.value);
    const selectedCompanyItem = useSelector((state) => state.company.selectedItem);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken")
        if (accessToken === "" || accessToken === null) {
            window.location.replace("/login");
        } else {
            const fetchData = async () => {
                if (await Utils.checkToken()) {
                    dispatch(removeSearchValue());
                    dispatch(clearSelectedCompany());
                    dispatch(clearCompanyList());
                    // await getNoticeList("");
                } else {
                    console.log("token expired");
                    NonoToast.error("????????? ??????????????? ?????????????????????.");
                    await Utils.timeout(1500);
                    window.location.replace("/login");
                }
            }

            fetchData();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getCompanyList(searchData, 1);
        }
        fetchData();
    }, [searchData]);

    async function getCompanyList(query, page) {
        updateLoading(true);
        const response = await CompanyAPI.getCompanyList("all", query, "name", "asc", page);
        if (response.isSuccess) {
            dispatch(updateCompanyList(response.data));
        }
        updateLoading(false);
    }

    const onClickSortButton = () => {
        console.log("onClick sort button");
    }

    const onClickAddButton = () => {
        updateOpenCompanyNew(true);
    }

    const onScrollCompanyList = async (event) => {
        const scrollY = event.target.scrollTop;

        if (scrollY >= (70 * (companyList.length - 8))) {
            if (!companyMetaData.lastPage && !isLoading) {
                await getCompanyList(searchData, (companyMetaData.page + 1));
            }
        }
    }

    const onClickDeleteItem = (item) => {
        dispatch(selectedCompany(item));
        updateOpenCompanyDeleteItem(true);

    }
    const onChangeProductSaveTypeSelection = async (item) => {
        const response = await CompanyAPI.updateCompanyInfo(
            item.companyId,
            item.name,
            item.type,
            item.category,
            !item.active);
        if (response.isSuccess) {
            dispatch(updateCompanyItem(response.data))
        } else {
            NonoToast.error("????????? ?????? ????????? ??????????????????. ???????????? ??? ?????? ????????? ?????????.");
        }
    }

    const onClickCompanyInfoEditButton = (item) => {
        dispatch(selectedCompany(item));
        updateOpenCompanyEdit(true);

    }
    const onCloseRemoveCompanyItemDialog = async () => {
        updateOpenCompanyDeleteItem(false);
        await refreshCompanyList();
    }

    const confirmRemoveCompanyItemDialog = async () => {
        const response = await CompanyAPI.deleteCompanyItem(selectedCompanyItem.companyId);
        if (response.isSuccess) {
            NonoToast.success("????????? ????????? ??????????????????.");
            updateOpenCompanyDeleteItem(false);
        } else {
            NonoToast.error("????????? ?????? ?????? ??? ????????? ?????????????????????.");
        }
        await refreshCompanyList();
    }

    const onCloseCompanyNewDialog = async () => {
        updateOpenCompanyNew(false);
        await refreshCompanyList();
    }

    async function refreshCompanyList() {
        dispatch(clearCompanyList());
        getCompanyList(searchData, 1);
    }

    const onCloseCompanyEditDialog = async () => {
        updateOpenCompanyEdit(false);
        await refreshCompanyList();
    }

    return (
        <div>
            <Modal isOpen={isOpenCompanyDeleteItem} onClose={onCloseRemoveCompanyItemDialog}>
                <CompanyDeleteModal
                    warning={true}
                    onCancel={onCloseRemoveCompanyItemDialog}
                    confirm={confirmRemoveCompanyItemDialog} />
            </Modal>
            <Modal isOpen={isOpenCompanyNew} onClose={onCloseCompanyNewDialog}>
                <CompanyNewModal onClose={onCloseCompanyNewDialog} />
            </Modal>
            <Modal isOpen={isOpenCpmpanyEdit} onClose={onCloseCompanyEditDialog}>
                <CompanyEditModal onClose={onCloseCompanyEditDialog} />
            </Modal>
            <ToastContainer />
            <div className="page">
                <SideBar value="/settings/company" />
                <div className="contentsPage">
                    <Header title="????????? ??????"
                        desc="?????? / ?????? ?????? ????????? ???????????? ???????????? ???????????? ???????????????."
                        isSearch={true} />
                    <div className="pageBody">
                        <div className="companyListPage">
                            <div className="companyListSection">
                                <div className="companyListTopButtonSection">
                                    <div className="emptySection" />
                                    <img src={AddBlue} alt="add"
                                        className="companyAddButton"
                                        onClick={onClickAddButton} />
                                    <img src={Sort} alt="sort"
                                        className="companySortButton"
                                        onClick={onClickSortButton} />

                                </div>

                                <div className="companyListTitle">
                                    <span className="companyListItemNameTitle">????????? ??????</span>
                                    <div className="emptySection" />
                                    <span className="companyListItemStatusTitle">????????? ??????</span>
                                </div>
                                <div className="companyList" onScroll={onScrollCompanyList}>
                                    {
                                        (companyList.length === 0 && searchData !== "") ?
                                            <div className="emptyCompanyListSection">
                                                <p>?????? ????????? ???????????? ????????????.</p>
                                            </div>
                                            :
                                            <ul>
                                                {
                                                    companyList.map((item, index) => {
                                                        return (
                                                            <li key={"productList" + item.productId + index}
                                                                className={item.active ? "companyListItem" : "inactiveCompanyListItem"} >
                                                                <div className="companyListItemInfoSection">
                                                                    <span className="companyListItemName">{item.name}</span>
                                                                    <span className="companyListItemDesc">{item.category}</span>
                                                                </div>
                                                                <div className="emptySection" />
                                                                <img src={Edit} className="companyItemInfoButton" onClick={() => onClickCompanyInfoEditButton(item)} />

                                                                <img src={Delete} className="companyItemDeleteButton" onClick={() => onClickDeleteItem(item)} />

                                                                {
                                                                    (item.type === "INPUT") ?
                                                                        <p className="companyListInputItemCategory">?????????</p> :
                                                                        <p className="companyListOutputItemCategory">?????????</p>
                                                                }


                                                                {/*  */}
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Company;