/**
 * Extended API Error Codes
 * @see https://api.docs.extended.exchange/#error-responses
 */

/** General HTTP error codes */
export type GeneralErrorCode =
	| "BAD_REQUEST"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "UNPROCESSABLE_ENTITY"
	| "INTERNAL_SERVER_ERROR";

/** Market, Asset & Account error codes */
export type MarketAssetAccountErrorCode =
	| "AssetNotFound"
	| "MarketNotFound"
	| "MarketDisabled"
	| "MarketGroupNotFound"
	| "AccountNotFound"
	| "NotSupportedInterval"
	| "UnhandledError"
	| "ClientNotFound"
	| "ActionNotAllowed"
	| "MaintenanceMode"
	| "PostOnlyMode"
	| "ReduceOnlyMode"
	| "InvalidPercentage"
	| "MarketReduceOnly";

/** Leverage update error codes */
export type LeverageErrorCode =
	| "InvalidLeverageBelowMinLeverage"
	| "InvalidLeverageExceedsMaxLeverage"
	| "InvalidLeverageMaxPositionValueExceeded"
	| "InvalidLeverageInsufficientMargin"
	| "InvalidLeverageInvalidPrecision";

/** StarkEx signatures error codes */
export type StarkExErrorCode =
	| "InvalidStarkExPublicKey"
	| "InvalidStarkExSignature"
	| "InvalidStarkExVault";

/** Order management error codes */
export type OrderErrorCode =
	| "OrderQtyLessThanMinTradeSize"
	| "InvalidQtyWrongSizeIncrement"
	| "OrderValueExceedsMaxOrderValue"
	| "InvalidQtyPrecision"
	| "InvalidPriceWrongPriceMovement"
	| "InvalidPricePrecision"
	| "MaxOpenOrdersNumberExceeded"
	| "MaxPositionValueExceeded"
	| "InvalidTradingFees"
	| "InvalidPositionTpslQty"
	| "MissingOrderPrice"
	| "MissingTpslTrigger"
	| "NotAllowedOrderType"
	| "InvalidOrderParameters"
	| "DuplicateOrder"
	| "InvalidOrderExpiration"
	| "ReduceOnlyOrderSizeExceedsPositionSize"
	| "ReduceOnlyOrderPositionIsMissing"
	| "ReduceOnlyOrderPositionSameSide"
	| "MarketOrderMustBeIOC"
	| "OrderCostExceedsBalance"
	| "InvalidPriceAmount"
	| "EditOrderNotFound"
	| "MissingConditionalTrigger"
	| "PostOnlyCantBeOnConditionalMarketOrder"
	| "NonReduceOnlyOrdersNotAllowed"
	| "TwapOrderMustBeGTT"
	| "OpenLossExceedsEquity"
	| "TPSLOpenLossExceedsEquity";

/** General account error codes */
export type AccountErrorCode = "AccountNotSelected";

/** Withdrawal error codes */
export type WithdrawalErrorCode =
	| "WithdrawalAmountMustBePositive"
	| "WithdrawalDescriptionToLong"
	| "WithdrawalRequestDoesNotMatchSettlement"
	| "WithdrawalEthAddressIsNotValid"
	| "WithdrawalExpirationTimeIsTooSoon"
	| "WithdrawalInvalidAsset"
	| "WithdrawalEthAddressMustBeAttachedToClient"
	| "WithdrawalBlockedForAccount"
	| "WithdrawalAccountDoesNotBelongToUser"
	| "WithdrawalDisabled"
	| "WithdrawalTransferFeeIsTooLow"
	| "WithdrawalStarkexTransferInvalidAmount"
	| "WithdrawalStarkexTransferInvalidExpirationTime"
	| "WithdrawalStarkexTransferInvalidReceiverPositionId"
	| "WithdrawalStarkexTransferInvalidReceiverPublicKey"
	| "WithdrawalStarkexTransferInvalidSenderPositionId"
	| "WithdrawalStarkexTransferInvalidSenderPublicKey"
	| "WithdrawalStarkexTransferInvalidSignature"
	| "WithdrawalDailyLimitExceed"
	| "WithdrawalRejectedTransfer"
	| "WithdrawalFailedRiskControls"
	| "WithdrawalIsNotAllowed"
	| "WithdrawalIsNotAllowedForInstitutionalClient";

/** Transfers error codes */
export type TransferErrorCode = "InvalidVaultTransferAmount";

/** Referral code error codes */
export type ReferralErrorCode =
	| "ReferralCodeAlreadyExist"
	| "ReferralCodeInvalid"
	| "ReferralProgramIsNotEnabled"
	| "ReferralCodeAlreadyApplied";

/** Union of all error codes */
export type ExtendedErrorCode =
	| GeneralErrorCode
	| MarketAssetAccountErrorCode
	| LeverageErrorCode
	| StarkExErrorCode
	| OrderErrorCode
	| AccountErrorCode
	| WithdrawalErrorCode
	| TransferErrorCode
	| ReferralErrorCode;

/** Error response structure */
export interface ExtendedError {
	/** Error code from the Extended API */
	code: ExtendedErrorCode;
	/** Descriptive error message */
	message: string;
}

/** Standard API error response format */
export interface ExtendedErrorResponse {
	/** Response status - always "ERROR" */
	status: "ERROR";
	/** Error details */
	error: ExtendedError;
}

/** HTTP status code mapping for general errors */
export const HTTP_STATUS_CODES: Record<GeneralErrorCode, number> = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
} as const;

/** Error code descriptions for reference */
export const ERROR_DESCRIPTIONS: Record<ExtendedErrorCode, string> = {
	// General errors
	BAD_REQUEST: "Invalid or missing parameters.",
	UNAUTHORIZED: "Authentication failure.",
	FORBIDDEN: "Access denied.",
	NOT_FOUND: "Resource not found.",
	UNPROCESSABLE_ENTITY: "Request format is correct, but data is invalid.",
	INTERNAL_SERVER_ERROR: "Internal server error.",

	// Market, Asset & Account errors
	AssetNotFound: "Asset not found.",
	MarketNotFound: "Market not found.",
	MarketDisabled: "Market is disabled.",
	MarketGroupNotFound: "Market group not found.",
	AccountNotFound: "Account not found.",
	NotSupportedInterval: "Not supported interval.",
	UnhandledError: "Application error.",
	ClientNotFound: "Client not found.",
	ActionNotAllowed: "Action is not allowed.",
	MaintenanceMode: "Maintenance mode.",
	PostOnlyMode: "Post only mode.",
	ReduceOnlyMode: "Reduce only mode.",
	InvalidPercentage: "Percentage should be between 0 and 1.",
	MarketReduceOnly:
		"Market is in reduce only mode, non-reduce only orders are not allowed.",

	// Leverage errors
	InvalidLeverageBelowMinLeverage: "Leverage below min leverage.",
	InvalidLeverageExceedsMaxLeverage: "Leverage exceeds max leverage.",
	InvalidLeverageMaxPositionValueExceeded:
		"Max position value exceeded for new leverage.",
	InvalidLeverageInsufficientMargin: "Insufficient margin for new leverage.",
	InvalidLeverageInvalidPrecision: "Leverage has invalid precision.",

	// StarkEx errors
	InvalidStarkExPublicKey: "Invalid StarkEx public key.",
	InvalidStarkExSignature: "Invalid StarkEx signature.",
	InvalidStarkExVault: "Invalid StarkEx vault.",

	// Order errors
	OrderQtyLessThanMinTradeSize:
		"Order quantity less than min trade size, based on market-specific trading rules.",
	InvalidQtyWrongSizeIncrement:
		"Invalid quantity due to the wrong size increment, based on market-specific Minimum Change in Trade Size trading rule.",
	OrderValueExceedsMaxOrderValue:
		"Order value exceeds max order value, based on market-specific trading rules.",
	InvalidQtyPrecision:
		"Invalid quantity precision, currently equals to market-specific Minimum Change in Trade Size.",
	InvalidPriceWrongPriceMovement:
		"Invalid price due to wrong price movement, based on market-specific Minimum Price Change trading rule.",
	InvalidPricePrecision:
		"Invalid price precision, currently equals to market-specific Minimum Price Change.",
	MaxOpenOrdersNumberExceeded:
		"Max open orders number exceeded, currently 200 orders per market.",
	MaxPositionValueExceeded:
		"Max position value exceeded, based on the Margin schedule.",
	InvalidTradingFees:
		"Trading fees are invalid. Refer to Order management section for details.",
	InvalidPositionTpslQty: "Invalid quantity for position TP/SL.",
	MissingOrderPrice: "Order price is missing.",
	MissingTpslTrigger: "TP/SL order trigger is missing.",
	NotAllowedOrderType: "Order type is not allowed.",
	InvalidOrderParameters: "Invalid order parameters.",
	DuplicateOrder: "Duplicate Order.",
	InvalidOrderExpiration:
		"Order expiration date must be within 90 days for the Mainnet, 28 days for the Testnet.",
	ReduceOnlyOrderSizeExceedsPositionSize:
		"Reduce-only order size exceeds open position size.",
	ReduceOnlyOrderPositionIsMissing:
		"Position is missing for a reduce-only order.",
	ReduceOnlyOrderPositionSameSide:
		"Position is the same side as a reduce-only order.",
	MarketOrderMustBeIOC: "Market order must have time in force IOC.",
	OrderCostExceedsBalance: "New order cost exceeds available balance.",
	InvalidPriceAmount: "Invalid price value.",
	EditOrderNotFound: "Edit order not found.",
	MissingConditionalTrigger: "Conditional order trigger is missing.",
	PostOnlyCantBeOnConditionalMarketOrder:
		"Conditional market order can't be Post-only.",
	NonReduceOnlyOrdersNotAllowed: "Non reduce-only orders are not allowed.",
	TwapOrderMustBeGTT: "Twap order must have time in force GTT.",
	OpenLossExceedsEquity: "Open loss exceeds equity.",
	TPSLOpenLossExceedsEquity: "TP/SL open loss exceeds equity.",

	// Account errors
	AccountNotSelected: "Account not selected.",

	// Withdrawal errors
	WithdrawalAmountMustBePositive: "Withdrawal amount must be positive.",
	WithdrawalDescriptionToLong: "Withdrawal description is too long.",
	WithdrawalRequestDoesNotMatchSettlement:
		"Withdrawal request does not match settlement.",
	WithdrawalEthAddressIsNotValid: "Withdrawal eth address is not valid.",
	WithdrawalExpirationTimeIsTooSoon: "Withdrawal expiration time is too soon.",
	WithdrawalInvalidAsset: "Withdrawal asset is not valid.",
	WithdrawalEthAddressMustBeAttachedToClient:
		"Withdrawal eth address must be attached to client.",
	WithdrawalBlockedForAccount: "Withdrawal blocked for the account.",
	WithdrawalAccountDoesNotBelongToUser:
		"Withdrawal account does not belong to user.",
	WithdrawalDisabled: "Withdrawal disabled at system.",
	WithdrawalTransferFeeIsTooLow: "Withdrawal transfer fee is too low.",
	WithdrawalStarkexTransferInvalidAmount:
		"Withdrawal starkex transfer invalid amount.",
	WithdrawalStarkexTransferInvalidExpirationTime:
		"Withdrawal starkex transfer invalid expiration time.",
	WithdrawalStarkexTransferInvalidReceiverPositionId:
		"Withdrawal starkex transfer invalid receiver position id.",
	WithdrawalStarkexTransferInvalidReceiverPublicKey:
		"Withdrawal Starkex Transfer Invalid Receiver Public Key.",
	WithdrawalStarkexTransferInvalidSenderPositionId:
		"Withdrawal starkex transfer invalid sender position id.",
	WithdrawalStarkexTransferInvalidSenderPublicKey:
		"Withdrawal starkex transfer invalid sender public key.",
	WithdrawalStarkexTransferInvalidSignature:
		"Withdrawal starkex transfer invalid signature.",
	WithdrawalDailyLimitExceed: "Withdrawal daily limit exceed.",
	WithdrawalRejectedTransfer: "Withdrawal connected transfer rejected.",
	WithdrawalFailedRiskControls: "Withdrawal failed risk controls.",
	WithdrawalIsNotAllowed: "Withdrawal is not allowed.",
	WithdrawalIsNotAllowedForInstitutionalClient:
		"Withdrawal is not allowed for institutional client.",

	// Transfer errors
	InvalidVaultTransferAmount: "Vault transfer amount is incorrect.",

	// Referral errors
	ReferralCodeAlreadyExist: "Referral code already exist.",
	ReferralCodeInvalid: "Referral code is not valid.",
	ReferralProgramIsNotEnabled: "Referral program is not enabled.",
	ReferralCodeAlreadyApplied: "Referral code already applied.",
} as const;
