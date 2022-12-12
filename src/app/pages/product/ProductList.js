import "./ProductList.css"
import Header from "../../components/common/header/Header.js"
import Sidebar from "../../components/common/sidebar/Sidebar.js"
import AddBlue from "../../../assets/images/addBlue.png"
import Sort from "../../../assets/images/sorting.png"
import EditBlue from "../../../assets/images/editBlue.png"
import ArrowBackward from "../../../assets/images/arrowBackward.png"
import ArrowForward from "../../../assets/images/arrowForward.png"
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import Utils from "../../../features/utils/Utils.js"
import NonoToast from "../../components/common/toast/Toast.js"
import { useEffect, useState } from "react"
import { removeSearchValue } from "../../../features/main/SearchSlice.js"
import ProductAPI from "../../../apis/product/product"
import { selectedProduct, updateProductList, updateProductRecordList } from "../../../features/product/productSlice"
import PopupBox from "../../components/common/modal/PopupBox"

const ProductList = () => {
    const [isLoading, updateLoading] = useState(false);
    const [selectedRecordMonth, setSelectedRecordMonth] = useState(new Date().getMonth());

    const dispatch = useDispatch();
    const searchData = useSelector((state) => state.search.value);
    const productList = useSelector((state) => state.product.itemList);
    const selectedProductItem = useSelector((state) => state.product.selectedItem);
    const recordList = useSelector((state) => state.product.selectedItemRecordList.recordList);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken")
        if (accessToken === "" || accessToken === null) {
            window.location.replace("/login");
        } else {
            const fetchData = async () => {
                if (await Utils.checkToken()) {
                    dispatch(removeSearchValue());
                    // await getNoticeList("");
                } else {
                    console.log("token expired");
                    NonoToast.error("로그인 유효기간이 만료되었습니다.");
                    await Utils.timeout(2000);
                    window.location.replace("/login");
                }
            }
            fetchData();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getProductList(searchData);
        }
        fetchData();
    }, [searchData]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedProductItem.productId !== undefined) {
                await getRecordList(selectedProductItem.productId, null, selectedRecordMonth);
            }
        }
        fetchData();
    }, [selectedProductItem]);

    async function getProductList(query, page) {
        updateLoading(true);
        const response = await ProductAPI.getProductList(query, "name", "desc", page)
        if (response.isSuccess) {
            dispatch(updateProductList(response.data))
        }
        updateLoading(false);
    }

    async function getRecordList(month) {
        updateLoading(true);
        const response = await ProductAPI.getRecordList(selectedProductItem.productId, null, month);
        if (response.isSuccess) {
            dispatch(updateProductRecordList(response.data));
        }
        updateLoading(false);
    }

    const onClickProductAddButton = () => {
        window.location.replace("/product/new")
    }

    const onClickProductEditButton = () => {

    }

    const sortCategory = [
        { value: "물품 이름", order: "asc" },
        { value: "물품 이름", order: "desc" },
        { value: "재고", order: "asc" },
        { value: "재고", order: "desc" },
    ]
    const [selectedSort, setSelectedSort] = useState(sortCategory[0]);
    const [isHiddenSortDialog, updateHiddenSortDialog] = useState(true);
    const onClickSortButton = (category) => {
        console.log("clicked sort button");
        updateHiddenSortDialog(!isHiddenSortDialog);
        setSelectedSort(category);
    }

    const onClickProductItem = (product) => {
        dispatch(selectedProduct(product));
    }

    const onClickRecordBackwardButton = () => {
        const backwardMonth = selectedRecordMonth - 1;
        if (backwardMonth < 1) {
            return
        }
        getRecordList(backwardMonth);
        setSelectedRecordMonth(backwardMonth);
    }

    const onClickRecordForwardButton = () => {
        const forwardMonth = selectedRecordMonth + 1;
        if (forwardMonth > 12) {
            return
        }
        getRecordList(forwardMonth);
        setSelectedRecordMonth(forwardMonth);
    }

    return (
        <div>
            <ToastContainer />
            <div className="page">
                <Sidebar value="/product/list" />
                <div className="contentsPage">
                    <Header title="물품 목록"
                        desc="물품 관리는 중요합니다!"
                        isSearch={true} />
                    <div className="pageBody">
                        <div className="productListPage">
                            <div className="productListSection">
                                <div className="productTopButtonSection">
                                    <div className="emptySection" />
                                    <img src={Sort} alt="sort"
                                        className="productSortButton"
                                        id="productSortSetting"
                                        aria-expanded="true"
                                        aria-haspopup="true"
                                        aira-controls="popupSortList"
                                        onClick={onClickSortButton} />
                                </div>
                                
                                <div className="productListTitle">
                                    <span className="productListItemPictureTitle">사진</span>
                                    <span className="productListItemNameTitle">물품 이름</span>
                                    <div className="emptySection" />
                                    <span className="productListItemCountTitle">재고</span>
                                </div>
                                <div className="productListSection">
                                    {
                                        (productList.length === 0 && searchData !== "") ?
                                            <div className="emptyProductListSection">
                                                <p>검색 결과가 존재하지 않습니다.</p>
                                            </div>
                                            :
                                            <ul>
                                                {
                                                    productList.map((item, index) => {
                                                        return (
                                                            <li key={"productList" + item.productId + index}
                                                                className={item.productId === selectedProductItem.productId ?
                                                                    "selectedProductListItem" :
                                                                    item.active ? "prouctListItem" : "inactiveProductListItem"}
                                                                onClick={() => onClickProductItem(item)}
                                                            >
                                                                <img src="https://th-bucket-s3.s3.ap-northeast-2.amazonaws.com/74ea3bca-a03b-4fd1-a995-9939e801da41-th.png" className="productListItemImage" />
                                                                <span className="productListItemName">{item.name}</span>
                                                                <div className="emptySection" />
                                                                <span className="productListItemCount">{item.stock} {item.unit}</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                    }
                                </div>
                            </div>

                            <div className="productContentsSection">
                                <div className="productTopButtonSection">
                                    <div className="emptySection" />
                                    <img src={AddBlue} alt="add"
                                        className="productAddButton"
                                        onClick={onClickProductAddButton} />
                                </div>

                                {
                                    selectedProductItem.productId === undefined ?
                                        <div className="emptyProductContentsSection">
                                            <p>내역이 존재하지 않습니다.</p>
                                        </div>
                                        :
                                        <div className="productContentSection">
                                            <div className="productContentInfoSection">
                                                <div className="productContentsummary">
                                                    <span className="productContentName">{selectedProductItem.name}</span>
                                                    <span className="productContentCount">{selectedProductItem.stock} {selectedProductItem.unit}</span>
                                                    <img src="https://th-bucket-s3.s3.ap-northeast-2.amazonaws.com/74ea3bca-a03b-4fd1-a995-9939e801da41-th.png" className="productContentItemImage" />
                                                </div>
                                                <div className="productContentDetailInfo">
                                                    <div className="productContentDetailTitle">
                                                        <span>상세정보</span>
                                                        <div className="emptySection" />
                                                        <img src={EditBlue} alt="edit"
                                                            onClick={onClickProductEditButton} />
                                                    </div>
                                                    <div className="productContentDetailContentsBox">
                                                        <div className="productDetailRowBox">
                                                            <div className="productDetailRowTitleBox">
                                                                <span>제품명</span>
                                                            </div>
                                                            <span>{selectedProductItem.name}</span>
                                                        </div>
                                                        <div className="productDetailRowBox">
                                                            <div className="productDetailRowTitleBox">
                                                                <span>제품코드</span>
                                                            </div>
                                                            <span>{selectedProductItem.productCode}</span>
                                                        </div>
                                                        <div className="productDetailRowBox">
                                                            <div className="productDetailRowTitleBox">
                                                                <span>분류</span>
                                                            </div>
                                                            <span>{selectedProductItem.category}</span>
                                                        </div>
                                                        <div className="productDetailRowBox">
                                                            <div className="productDetailRowTitleBox">
                                                                <span>보관방법</span>
                                                            </div>
                                                            <span>{selectedProductItem.storageType}</span>
                                                        </div>
                                                        <div className="productDetailRowBox">
                                                            <div className="productDetailRowTitleBox">
                                                                <span>제조사</span>
                                                            </div>
                                                            <span>{selectedProductItem.maker}</span>
                                                        </div>
                                                        <div className="productDetailRowBox">
                                                            <div className="productDetailRowTitleBox">
                                                                <span>규격</span>
                                                            </div>
                                                            <span>{selectedProductItem.unit}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="productContentRecordSection">
                                                <div className="productContentRecordTitle">
                                                    <span>상세정보</span>
                                                    <div className="emptySection" />
                                                    <img src={ArrowBackward} alt="backward"
                                                        onClick={onClickRecordBackwardButton} />
                                                    <span className="productRecordCurrentMonth"> {selectedRecordMonth}월</span>
                                                    <img src={ArrowForward} alt="forward"
                                                        onClick={onClickRecordForwardButton} />
                                                </div>
                                                <div className="productListTitle">
                                                    <span className="productRecordListDateTitle">날짜</span>
                                                    <div className="emptySection" />
                                                    <span className="productRecordListWriterTitle">작성자</span>
                                                    <span className="productRecordListQuantityTitle">변화량</span>
                                                    <span className="productRecordListStockTitle">재고</span>
                                                </div>
                                                <div className="productRecordList">
                                                    {
                                                        (recordList === undefined || recordList.length === 0) ?
                                                            <div className="emptyProductListSection">
                                                                <p>내역이 존재하지 않습니다.</p>
                                                            </div>
                                                            :
                                                            <ul>
                                                                {
                                                                    recordList.map((item, index) => {
                                                                        return (
                                                                            <li key={"recordList" + item.recordId + index}>
                                                                                <div className="productRecordListItemBox">
                                                                                    <span className="recordItemDate">{item.date}</span>
                                                                                    <div className="emptySection" />
                                                                                    <span className="recordItemWriter">{item.writer}</span>
                                                                                    <span className={item.type === "OUTPUT" ? "recordItemQuantityOutput" : "recordItemQuantityInput"} >
                                                                                        {item.type === "OUTPUT" ? "-" : "+"}{item.quantity}
                                                                                    </span>
                                                                                    <span className="recordItemStock">{item.stock} {selectedProductItem.unit}</span>

                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    );
}

export default ProductList;