import "./ProductEdit.css"
import { ToastContainer } from "react-toastify";
import Header from "../../components/common/header/Header.js"
import Sidebar from "../../components/common/sidebar/Sidebar.js"
import AssentialPoint from "../../../assets/images/assentialPoint.png"
import EmptyImage from "../../../assets/images/emptyImage.png"
import TextField from "../../components/login/TextField.js";
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/common/button/PrimaryButton";
import NonoToast from "../../components/common/toast/Toast";
import Modal from "../../components/common/modal/Modal";
import Dialog from "../../components/common/modal/Dialog";
import UtilAPI from "../../../apis/etc/util";
import ProductAPI from "../../../apis/product/Product";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Utils from "../../../features/utils/Utils";
import { selectedProduct } from "../../../features/product/productSlice";

const ProductEdit = () => {
    const [productName, setProductName] = useState("");
    const [isValidProductName, updateValidProductName] = useState(true);
    const [productImageName, setProductImageName] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [productDescription, setProductDescription] = useState("");
    const [productBarCode, setProductBarCode] = useState("");
    const [productCode, setProductCode] = useState("");
    const [isValidProductCode, updateValidProductCode] = useState(true);
    const [productCategory, setProductCategorySelection] = useState("");
    const [isValidProductCategory, updateValidProductCategory] = useState(false)
    const [productSaveType, setProductSaveTypeSelection] = useState("");
    const [isValidProductSaveType, updateValidProductSaveType] = useState(false)
    const [productUnit, setProductUnit] = useState("");
    const [isValidProductUnit, updateValidProductUnit] = useState(true);
    const [productMaker, setProductMaker] = useState("");
    const [isValidProductMaker, updateValidProductMaker] = useState(true);
    const [productStock, setProductStock] = useState(0);
    const [productInputPrice, setProductInputPrice] = useState(0);
    const [productOutputPrice, setProductOutputPrice] = useState(0);
    const [isEnableSaveButton, updateEnableSaveButton] = useState(false);
    const [isOpenSaveProductConfirm, updateOpenSaveProductConfirm] = useState(false);
    const [productActiveType, setProductActiveType] = useState(true);

    const productSaveTypeList = [
        { value: "??????", code: "NONE" },
        { value: "??????", code: "ROOM" },
        { value: "??????", code: "COLD" },
        { value: "??????", code: "ICE" }
    ]

    const productCategoryList = [
        "??????",
        "?????? ??????",
        "?????????",
        "?????????",
        "?????? ??????",
        "?????????",
        "??????"
    ]

    const productActiveTypeList = [
        { value: "??????", code: true },
        { value: "?????????", code: false }
    ]

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedProductItem = useSelector((state) => state.product.selectedItem);
    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken")
        if (accessToken === "" || accessToken === null) {
            window.location.replace("/login");
        } else {
            const fetchData = async () => {
                if (await Utils.checkToken()) {
                    const productId = selectedProductItem.productId;
                    if (productId !== null) {
                        const response = await ProductAPI.getProductItem(productId);
                        if (response.isSuccess) {
                            dispatch(selectedProduct(response.data))
                        } else {
                            NonoToast.error(response.errorMessage);
                            await Utils.timeout(1000);
                            navigate("/product/list");
                        }
                    }
                } else {
                    console.log("token expired");
                    NonoToast.error("????????? ??????????????? ?????????????????????.");
                    await Utils.timeout(1000);
                    window.location.replace("/login");
                }
            }
            fetchData();
        }
        console.log(selectedProductItem);
    }, []);

    useEffect(() => {
        onChangeProductName(selectedProductItem.name);
        setProductDescription(selectedProductItem.description);
        onChangeProductCode(selectedProductItem.productCode);
        setProductCategorySelection(selectedProductItem.category);
        productCategoryValidation(selectedProductItem.category);
        setProductSaveTypeSelection(selectedProductItem.storageType);
        productSaveTypeValidation(selectedProductItem.storageType);
        onChangeProductUnit(selectedProductItem.unit);
        onChangeProductMaker(selectedProductItem.maker);
        onChangeProductStock(selectedProductItem.stock);
        onChangeProductInputPrice(selectedProductItem.inputPrice);
        onChangeProductOutputPrice(selectedProductItem.outputPrice);
        if (selectedProductItem.barcode === "") {
            setProductBarCode(null);
        } else {
            setProductBarCode(selectedProductItem.barcode);
        }
        setProductActiveType(selectedProductItem.active);
        updateSaveButtonValidation();

        console.log(isValidProductName);
        console.log(isValidProductCode);
        console.log(isValidProductUnit);
        console.log(isValidProductCategory);
        console.log(isValidProductSaveType);
        console.log(isValidProductMaker);
        console.log(isEnableSaveButton);
        console.log(productImage);

    }, [selectedProductItem]);

    const onChangeProductName = (value) => {
        setProductName(value);
        productNameValidation(value);
    }
    function productNameValidation(value) {
        const isInValidProductName = (value === undefined || value === "" || value === null)
        updateValidProductName(!isInValidProductName);
    }

    const onChangeProductDescription = (event) => {
        setProductDescription(event.target.value);
    }

    const onChangeProductCode = (value) => {
        setProductCode(value);
        productCodeValidation(value);
    }
    function productCodeValidation(value) {
        const isInValidProductCode = (value === undefined || value === "" || value === null)
        updateValidProductCode(!isInValidProductCode);
    }
    const onChangeProductCategorySelection = (event) => {
        setProductCategorySelection(event.target.value);
        productCategoryValidation(event.target.value);
    }
    function productCategoryValidation(value) {
        const isInvalidProductCategory = (value === "" || value === "??????")
        updateValidProductCategory(!isInvalidProductCategory);
    }

    const onChangeProductSaveTypeSelection = (event) => {
        console.log(event.target.value);
        setProductSaveTypeSelection(event.target.value);
        productSaveTypeValidation(event.target.value);
    }
    function productSaveTypeValidation(value) {
        const isInvalidProductSaveType = (value === "" || value === "NONE")
        updateValidProductSaveType(!isInvalidProductSaveType);
    }

    const onChangeProductUnit = (value) => {
        setProductUnit(value);
        productUnitValidation(value);
    }
    function productUnitValidation(value) {
        const isInvalidProductUnit = (value === undefined || value === "" || value === null)
        updateValidProductUnit(!isInvalidProductUnit);
    }
    const onChangeProductMaker = (value) => {
        setProductMaker(value);
        productMakerValidation(value);
    }
    function productMakerValidation(value) {
        const isInvalidProductMaker = (value === undefined || value === "" || value === null)
        updateValidProductMaker(!isInvalidProductMaker);
    }

    const onChangeProductStock = (value) => {
        if (value === null || value === undefined) {
            setProductStock(0);
        } else {
            setProductStock(value);
        }
    }

    const onChangeProductInputPrice = (value) => {
        const price = Number(value)
        setProductInputPrice(price)
    }
    const onChangeProductOutputPrice = (value) => {
        const price = Number(value)
        setProductOutputPrice(price)
    }

    const updateSaveButtonValidation = () => {
        const isValidSaveButton = isValidProductName && isValidProductCode && isValidProductUnit && isValidProductCategory && isValidProductSaveType && isValidProductMaker
        updateEnableSaveButton(isValidSaveButton);
    }
    function checkValidation() {
        productNameValidation(productName)
        productCodeValidation(productCode)
        productUnitValidation(productUnit)
        productCategoryValidation(productCategory)
        productSaveTypeValidation(productSaveType)
        productMakerValidation(productMaker)
    }
    const onCLickSaveButton = () => {
        const isInValidProductName = (productName === undefined || productName === "" || productName === null)
        const isInValidProductCode = (productCode === undefined || productCode === "" || productCode === null)
        const isInvalidProductUnit = (productUnit === undefined || productUnit === "" || productUnit === null)
        const isInvalidProductCategory = (productCategory === "" || productCategory === "??????")
        const isInavlidProductSaveType = (productSaveType === "" || productSaveType === "??????")
        const isInvalidProductMaker = (productMaker === undefined || productMaker === "" || productMaker === null)

        if (isInValidProductName) {
            NonoToast.error("?????? ????????? ????????? ?????????!");
            checkValidation();
            return
        } else if (isInValidProductCode) {
            NonoToast.error("?????? ????????? ????????? ?????????!");
            checkValidation();
            return
        } else if (isInvalidProductUnit) {
            NonoToast.error("?????? ????????? ????????? ?????????!");
            checkValidation();
            return
        } else if (isInvalidProductCategory) {
            NonoToast.error("?????? ????????? ????????? ?????????!");
            checkValidation();
            return
        } else if (isInavlidProductSaveType) {
            NonoToast.error("?????? ?????? ????????? ????????? ?????????!");
            checkValidation();
            return
        } else if (isInvalidProductMaker) {
            NonoToast.error("???????????? ????????? ?????????!");
            return
        }

        // confirm dialog open
        updateOpenSaveProductConfirm(true);
    }
    const onUpdatedImageFile = (file) => {
        if (file.length === 1 && file[0]) {
            setProductImage(file[0]);
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('productImage').src = e.target.result;
                setProductImageName(file[0].name);
            };
            reader.readAsDataURL(file[0]);

        }
    }

    const canceledSaveProduct = () => {
        updateOpenSaveProductConfirm(false);
    }

    const confirmSaveProduct = async () => {
        updateOpenSaveProductConfirm(false);

        if (productImage != null) {
            const uploadImageResponse = await UtilAPI.uploadImage(productImage);
            if (uploadImageResponse.isSuccess) {
                const fileId = uploadImageResponse.data.fileId;
                const response = await ProductAPI.updateProduct(
                    selectedProductItem.productId,
                    productCode,
                    productName,
                    productDescription,
                    productCategory,
                    productMaker,
                    productUnit,
                    productSaveType,
                    productStock,
                    productInputPrice,
                    productOutputPrice,
                    productActiveType,
                    fileId);

                if (response.isSuccess) {
                    NonoToast.success("?????? ????????? ?????????????????????.");
                    await Utils.timeout(1000);
                    navigate("/product/list");

                } else {
                    NonoToast.error("?????? ?????? ????????? ??????????????????.");
                    console.log(response.errorMessage);
                }
            } else {
                NonoToast.error("?????? ?????? ????????? ??????????????????.");
                console.log("image upload fail");
            }
        } else {
            const response = await ProductAPI.updateProduct(
                selectedProductItem.productId,
                productCode,
                productName,
                productDescription,
                productCategory,
                productMaker,
                productUnit,
                productSaveType,
                productStock,
                productInputPrice,
                productOutputPrice,
                productActiveType,
                "");

            if (response.isSuccess) {
                NonoToast.success("?????? ????????? ?????????????????????.");
                await Utils.timeout(1000);
                navigate("/product/list");
            } else {
                NonoToast.error("?????? ?????? ????????? ??????????????????.");
                console.log(response.errorMessage);
            }
        }
    }

    const getSelectedImage = (image) => {
        if (image === null || image === undefined) {
            return EmptyImage
        } else {
            const getThumbnailUrl = image.thumbnailUrl;
            if (getThumbnailUrl === null) {
                return EmptyImage;
            } else {
                return image.thumbnailUrl;
            }
        }
    }
    return (
        <div>
            <ToastContainer />
            <Modal isOpen={isOpenSaveProductConfirm}>
                <Dialog title="?????? ??????"
                    contents="?????? ???????????????????"
                    warning={false}
                    onCancel={canceledSaveProduct}
                    confirm={confirmSaveProduct} />
            </Modal>
            <div className="page">
                <Sidebar value="/product/list" />
                <div className="contentsPage">
                    <Header title="??? ?????? ??????"
                        desc="????????? ???????????????." />
                    <div className="pageBody">
                        <ul className="newProductItemForm">
                            <li>
                                <div className="productImagetitleBox">
                                    <div className="assentialPointImage" />
                                    <span>?????? ?????????</span>
                                </div>
                                <div className="productImageDescription">
                                    <span>*png ????????? ??????</span>
                                    <span>???????????? 1:1 ???????????? ???????????? ????????? ?????????.</span>
                                    <span>*500kb ?????? ????????? ????????? ????????????.</span>
                                    <div className="emptySpace" />
                                    {/* <div className="loadProductImageButton"
                                        onClick={onClickLoadProductImageButton}>
                                        <span>????????????</span>
                                    </div> */}
                                    <div className="loadProductImageButton">
                                        <label className="loadProductImageButtonLabel"
                                            htmlFor="loadProductImage">????????????</label>
                                        <input type="file"
                                            accept="image/*"
                                            id="loadProductImage"
                                            onChange={({ target: { files } }) => {
                                                onUpdatedImageFile(files)
                                            }} />
                                        <span className="loadProductImageFileNameLabel">{productImageName}</span>
                                    </div>

                                </div>
                                <img src={productImage ?? getSelectedImage(selectedProductItem.image)}
                                    className="productImageItem"
                                    id="productImage" />
                            </li>
                            <li>
                                <div className="productNameTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>?????? ??????</span>
                                </div>
                                <div className="productNameTextField">
                                    <TextField
                                        type="text"
                                        isValidData={isValidProductName}
                                        value={productName}
                                        onChange={value => {
                                            onChangeProductName(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        placeholder="?????? ????????? ????????? ?????????!" />
                                </div>
                            </li>
                            <li>
                                <div className="productDescriptionTitleBox">
                                    <div className="assentialPointImage" />
                                    <span>?????? ??????</span>
                                </div>
                                <div className="productDescriptionTextField">
                                    <textarea
                                        onChange={(value) => onChangeProductDescription(value)}
                                        value={productDescription}
                                        placeholder="?????? ????????? ????????? ??????, ????????? ????????? ?????????!" />
                                </div>
                            </li>
                            <li>
                                <div className="productCodeTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>?????? ??????</span>
                                </div>
                                <div className="productCodeTextField">
                                    <TextField
                                        isValidData={isValidProductCode}
                                        type="text"
                                        value={productCode}
                                        onChange={value => {
                                            onChangeProductCode(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        placeholder="?????? ????????? ????????? ?????????!" />
                                </div>
                            </li>
                            <li>
                                <div className="productBarCodeTitleBox">
                                    <div className="assentialPointImage" />
                                    <span>?????????</span>
                                </div>
                                <div className="productBarCodeTextField">
                                    <span>{productBarCode ?? "???????????? ????????? ?????? ?????? ????????? ???????????????."}</span>
                                </div>
                            </li>
                            <li>
                                <div className="productActiveTypeTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>?????????</span>
                                </div>
                                <div className="productActiveTypeSelectBox">
                                    <select className="productActiveTypeSelect"
                                        value={productActiveType ?? true}
                                        onChange={onChangeProductSaveTypeSelection}
                                        onBlur={updateSaveButtonValidation}>
                                        {
                                            productActiveTypeList.map((item, index) => {
                                                return (
                                                    <option key={"productActiveType" + index} value={item.code}>{item.value}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div className="productCategoryTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>?????? ??????</span>
                                </div>
                                <div className="productCategorySelectBox">
                                    <select className="productCategorySelect"
                                        value={productCategory ?? "??????"}
                                        onChange={onChangeProductCategorySelection}
                                        onBlur={updateSaveButtonValidation}>
                                        {
                                            productCategoryList.map((item, index) => {
                                                return (
                                                    <option key={"productCategory" + index} value={item}>{item}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div className="productSaveTypeTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>?????? ??????</span>
                                </div>
                                <div className="productSaveTypeSelectBox">
                                    <select className="productSaveTypeSelect"
                                        value={productSaveType ?? "NONE"}
                                        onChange={onChangeProductSaveTypeSelection}
                                        onBlur={updateSaveButtonValidation}>
                                        {
                                            productSaveTypeList.map((item, index) => {
                                                return (
                                                    <option key={"productSaveType" + index} value={item.code}>{item.value}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div className="productUnitTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>??????</span>
                                </div>
                                <div className="productUnitTextField">
                                    <TextField
                                        isValidData={isValidProductUnit}
                                        value={productUnit}
                                        onChange={value => {
                                            onChangeProductUnit(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        type="text"
                                        placeholder="?????? ????????? ????????? ?????????!" />
                                </div>
                            </li>
                            <li>
                                <div className="productMakerTitleBox">
                                    <img src={AssentialPoint} className="assentialPointImage" />
                                    <span>?????????</span>
                                </div>
                                <div className="productMakerTextField">
                                    <TextField isValidData={true}
                                        type="text"
                                        value={productMaker}
                                        onChange={value => {
                                            onChangeProductMaker(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        placeholder="????????? ????????? ????????? ?????????!" />
                                </div>
                            </li>
                            <li>
                                <div className="productStockTitleBox">
                                    <div className="assentialPointImage" />
                                    <span>??????</span>
                                </div>
                                <div className="productStockTextField">
                                    <TextField isValidData={true}
                                        type="text"
                                        value={productStock}
                                        onChange={value => {
                                            onChangeProductStock(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        placeholder="?????? ????????? ????????? ?????????!" />
                                </div>
                            </li>
                            <li>
                                <div className="productPriceTitleBox">
                                    <div className="assentialPointImage" />
                                    <span>?????? ?????? ??????</span>
                                </div>
                                <div className="productPriceTextField">
                                    <TextField isValidData={true}
                                        type="text"
                                        value={productInputPrice}
                                        onChange={value => {
                                            onChangeProductInputPrice(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        placeholder="?????? ????????? ????????? ?????????." />
                                </div>
                                <div className="productPriceUnitLabelBox">
                                    <span>???</span>
                                </div>
                            </li>
                            <li>
                                <div className="productPriceTitleBox">
                                    <div className="assentialPointImage" />
                                    <span>?????? ?????? ??????</span>
                                </div>
                                <div className="productPriceTextField">
                                    <TextField isValidData={true}
                                        type="text"
                                        value={productOutputPrice}
                                        onChange={value => {
                                            onChangeProductOutputPrice(value);
                                        }}
                                        onFocusOut={updateSaveButtonValidation}
                                        placeholder="?????? ????????? ????????? ?????????." />
                                </div>
                                <div className="productPriceUnitLabelBox">
                                    <span>???</span>
                                </div>
                            </li>
                            <li />
                            <li>
                                <div className="saveProductInfoBox">
                                    <div className="saveProductInfoButton">
                                        <PrimaryButton value="????????????"
                                            disabled={!isEnableSaveButton}
                                            onClick={onCLickSaveButton} />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductEdit;