// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainManagement {
    // Enum to track product status
    enum ProductStatus { 
        Manufactured,
        PackedForShipment,
        InTransit,
        DeliveredToWarehouse,
        DeliveredToRetailer,
        PurchasedByCustomer
    }

    // Structure to store shipment updates
    struct ShipmentUpdate {
        address updatedBy;
        uint256 timestamp;
        string location;
        string notes;
        ProductStatus newStatus;
    }

    // Structure to store GI tag information
    struct GITagInfo {
        uint256 giTagNumber;
        string region;
        string traditionalMethod;
        uint256 registrationDate;
        bool isValid;
    }

    // Structure to store product details
    struct Product {
        uint256 id;
        string name;
        address manufacturer;
        address currentOwner;
        uint256 manufactureDate;
        string manufacturingLocation;
        ProductStatus status;
        uint256 giTagNumber;  // New field
        mapping(uint256 => ShipmentUpdate) shipmentUpdates;
        uint256 updateCount;
    }

    // New struct for returning complete product information including history
    struct ProductInfo {
        uint256 id;
        string name;
        address manufacturer;
        address currentOwner;
        uint256 manufactureDate;
        string manufacturingLocation;
        ProductStatus status;
        uint256 giTagNumber;  // New field
        uint256 updateCount;
        ShipmentUpdate[] shipmentHistory;
    }

    // State variables
    mapping(uint256 => Product) public products;
    mapping(uint256 => GITagInfo) public giTags;  // New mapping
    uint256 public productCount;
    
    // Access control
    mapping(address => bool) private authorizedManufacturers;
    mapping(address => bool) private authorizedShippers;
    mapping(address => bool) private authorizedRetailers;
    
    address public owner;

    // Events
    event ProductManufactured(uint256 indexed productId, string name, address manufacturer, uint256 giTagNumber);
    event GITagRegistered(uint256 indexed giTagNumber, string region, string traditionalMethod);
    event ProductStatusUpdated(uint256 indexed productId, ProductStatus newStatus);
    event OwnershipTransferred(uint256 indexed productId, address from, address to);
    event ShipmentUpdateAdded(uint256 indexed productId, string location, string notes);

    // Existing modifiers remain the same...
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this");
        _;
    }

    modifier onlyManufacturer() {
        require(authorizedManufacturers[msg.sender], "Only authorized manufacturer can call this");
        _;
    }

    modifier onlyShipper() {
        require(authorizedShippers[msg.sender], "Only authorized shipper can call this");
        _;
    }

    modifier onlyRetailer() {
        require(authorizedRetailers[msg.sender], "Only authorized retailer can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addManufacturer(address _manufacturer) external onlyOwner {
        authorizedManufacturers[_manufacturer] = true;
    }

    function addShipper(address _shipper) external onlyOwner {
        authorizedShippers[_shipper] = true;
    }

    function addRetailer(address _retailer) external onlyOwner {
        authorizedRetailers[_retailer] = true;
    }

    // New function to register GI tag
    function registerGITag(
        uint256 _giTagNumber,
        string memory _region,
        string memory _traditionalMethod
    ) external onlyOwner {
        require(!giTags[_giTagNumber].isValid, "GI tag already registered");
        
        giTags[_giTagNumber] = GITagInfo({
            giTagNumber: _giTagNumber,
            region: _region,
            traditionalMethod: _traditionalMethod,
            registrationDate: block.timestamp,
            isValid: true
        });

        emit GITagRegistered(_giTagNumber, _region, _traditionalMethod);
    }

    // Modified manufacture product function to include GI tag
    function manufactureProduct(
        string memory _name,
        string memory _location,
        uint256 _giTagNumber
    ) external onlyManufacturer returns (uint256) {
        require(giTags[_giTagNumber].isValid, "Invalid GI tag number");
        
        productCount++;
        uint256 productId = productCount;

        Product storage newProduct = products[productId];
        newProduct.id = productId;
        newProduct.name = _name;
        newProduct.manufacturer = msg.sender;
        newProduct.currentOwner = msg.sender;
        newProduct.manufactureDate = block.timestamp;
        newProduct.manufacturingLocation = _location;
        newProduct.status = ProductStatus.Manufactured;
        newProduct.giTagNumber = _giTagNumber;  // Set GI tag number
        newProduct.updateCount = 0;

        emit ProductManufactured(productId, _name, msg.sender, _giTagNumber);
        return productId;
    }

    // New function to get manufacturing info by GI tag
    function getManufacturingInfoByGITag(uint256 _giTagNumber) external view returns (
        GITagInfo memory giInfo,
        ProductInfo[] memory _matchingProducts
    ) {
        require(giTags[_giTagNumber].isValid, "Invalid GI tag number");
        
        // First, count products with this GI tag
        uint256 count = 0;
        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].giTagNumber == _giTagNumber) {
                count++;
            }
        }
        
        // Create array of matching products
        ProductInfo[] memory matchingProducts = new ProductInfo[](count);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].giTagNumber == _giTagNumber) {
                matchingProducts[currentIndex] = getProduct(i);
                currentIndex++;
            }
        }
        
        return (giTags[_giTagNumber], matchingProducts);
    }

    // Existing functions remain the same...
     function getShipmentUpdate(uint256 _productId, uint256 _updateId) external view returns (
        address updatedBy,
        uint256 timestamp,
        string memory location,
        string memory notes,
        ProductStatus newStatus
    ) {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        require(_updateId <= product.updateCount && _updateId > 0, "Invalid update ID");

        ShipmentUpdate storage update = product.shipmentUpdates[_updateId];
        return (
            update.updatedBy,
            update.timestamp,
            update.location,
            update.notes,
            update.newStatus
        );
    }

    function transferOwnership(
        uint256 _productId,
        address _newOwner
    ) external {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        require(product.currentOwner == msg.sender, "Only current owner can transfer ownership");
        require(_newOwner != address(0), "Invalid new owner address");

        address previousOwner = product.currentOwner;
        product.currentOwner = _newOwner;

        emit OwnershipTransferred(_productId, previousOwner, _newOwner);
    }

    function updateProductStatus(
        uint256 _productId,
        ProductStatus _newStatus,
        string memory _location,
        string memory _notes
    ) external {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        
        // Validate status update based on role
        if (_newStatus == ProductStatus.PackedForShipment) {
            require(msg.sender == product.manufacturer, "Only manufacturer can pack product");
        } else if (_newStatus == ProductStatus.InTransit || _newStatus == ProductStatus.DeliveredToWarehouse) {
            require(authorizedShippers[msg.sender], "Only shipper can update transit status");
        } else if (_newStatus == ProductStatus.DeliveredToRetailer || _newStatus == ProductStatus.PurchasedByCustomer) {
            require(authorizedRetailers[msg.sender], "Only retailer can update final status");
        }

        // Add shipment update
        product.updateCount++;
        ShipmentUpdate storage update = product.shipmentUpdates[product.updateCount];
        update.updatedBy = msg.sender;
        update.timestamp = block.timestamp;
        update.location = _location;
        update.notes = _notes;
        update.newStatus = _newStatus;

        // Update product status
        product.status = _newStatus;

        emit ProductStatusUpdated(_productId, _newStatus);
        emit ShipmentUpdateAdded(_productId, _location, _notes);
    }


    
    // Modified getProduct function to include GI tag
    function getProduct(uint256 _productId) public view returns (ProductInfo memory) {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        
        ShipmentUpdate[] memory shipmentHistory = new ShipmentUpdate[](product.updateCount);
        for (uint256 i = 1; i <= product.updateCount; i++) {
            ShipmentUpdate storage update = product.shipmentUpdates[i];
            shipmentHistory[i-1] = ShipmentUpdate({
                updatedBy: update.updatedBy,
                timestamp: update.timestamp,
                location: update.location,
                notes: update.notes,
                newStatus: update.newStatus
            });
        }
        
        return ProductInfo({
            id: product.id,
            name: product.name,
            manufacturer: product.manufacturer,
            currentOwner: product.currentOwner,
            manufactureDate: product.manufactureDate,
            manufacturingLocation: product.manufacturingLocation,
            status: product.status,
            giTagNumber: product.giTagNumber,
            updateCount: product.updateCount,
            shipmentHistory: shipmentHistory
        });
    }
}