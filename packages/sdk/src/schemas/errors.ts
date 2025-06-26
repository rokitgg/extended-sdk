import { z } from "zod";

// General HTTP error codes
export const GeneralErrorCodeSchema = z.enum([
	"BAD_REQUEST",
	"UNAUTHORIZED",
	"FORBIDDEN",
	"NOT_FOUND",
	"UNPROCESSABLE_ENTITY",
	"INTERNAL_SERVER_ERROR",
]);

// Market, Asset & Account error codes
export const MarketAssetAccountErrorCodeSchema = z.enum([
	"AssetNotFound",
	"MarketNotFound",
	"MarketDisabled",
	"MarketGroupNotFound",
	"AccountNotFound",
	"NotSupportedInterval",
	"UnhandledError",
	"ClientNotFound",
	"ActionNotAllowed",
	"MaintenanceMode",
	"PostOnlyMode",
	"ReduceOnlyMode",
	"InvalidPercentage",
	"MarketReduceOnly",
]);

// Leverage update error codes
export const LeverageErrorCodeSchema = z.enum([
	"InvalidLeverageBelowMinLeverage",
	"InvalidLeverageExceedsMaxLeverage",
	"InvalidLeverageMaxPositionValueExceeded",
	"InvalidLeverageInsufficientMargin",
	"InvalidLeverageInvalidPrecision",
]);

// StarkEx signatures error codes
export const StarkExErrorCodeSchema = z.enum([
	"InvalidStarkExPublicKey",
	"InvalidStarkExSignature",
	"InvalidStarkExVault",
]);

// Order management error codes
export const OrderErrorCodeSchema = z.enum([
	"OrderQtyLessThanMinTradeSize",
	"InvalidQtyWrongSizeIncrement",
	"OrderValueExceedsMaxOrderValue",
	"InvalidQtyPrecision",
	"InvalidPriceWrongPriceMovement",
	"InvalidPricePrecision",
	"MaxOpenOrdersNumberExceeded",
	"MaxPositionValueExceeded",
	"InvalidTradingFees",
	"InvalidPositionTpslQty",
	"MissingOrderPrice",
	"MissingTpslTrigger",
	"NotAllowedOrderType",
	"InvalidOrderParameters",
	"DuplicateOrder",
	"InvalidOrderExpiration",
	"ReduceOnlyOrderSizeExceedsPositionSize",
	"ReduceOnlyOrderPositionIsMissing",
	"ReduceOnlyOrderPositionSameSide",
	"MarketOrderMustBeIOC",
	"OrderCostExceedsBalance",
	"InvalidPriceAmount",
	"EditOrderNotFound",
	"MissingConditionalTrigger",
	"PostOnlyCantBeOnConditionalMarketOrder",
	"NonReduceOnlyOrdersNotAllowed",
	"TwapOrderMustBeGTT",
	"OpenLossExceedsEquity",
	"TPSLOpenLossExceedsEquity",
]);

// General account error codes
export const AccountErrorCodeSchema = z.enum(["AccountNotSelected"]);

// Withdrawal error codes
export const WithdrawalErrorCodeSchema = z.enum([
	"WithdrawalAmountMustBePositive",
	"WithdrawalDescriptionToLong",
	"WithdrawalRequestDoesNotMatchSettlement",
	"WithdrawalEthAddressIsNotValid",
	"WithdrawalExpirationTimeIsTooSoon",
	"WithdrawalInvalidAsset",
	"WithdrawalEthAddressMustBeAttachedToClient",
	"WithdrawalBlockedForAccount",
	"WithdrawalAccountDoesNotBelongToUser",
	"WithdrawalDisabled",
	"WithdrawalTransferFeeIsTooLow",
	"WithdrawalStarkexTransferInvalidAmount",
	"WithdrawalStarkexTransferInvalidExpirationTime",
	"WithdrawalStarkexTransferInvalidReceiverPositionId",
	"WithdrawalStarkexTransferInvalidReceiverPublicKey",
	"WithdrawalStarkexTransferInvalidSenderPositionId",
	"WithdrawalStarkexTransferInvalidSenderPublicKey",
	"WithdrawalStarkexTransferInvalidSignature",
	"WithdrawalDailyLimitExceed",
	"WithdrawalRejectedTransfer",
	"WithdrawalFailedRiskControls",
	"WithdrawalIsNotAllowed",
	"WithdrawalIsNotAllowedForInstitutionalClient",
]);

// Transfers error codes
export const TransferErrorCodeSchema = z.enum(["InvalidVaultTransferAmount"]);

// Referral code error codes
export const ReferralErrorCodeSchema = z.enum([
	"ReferralCodeAlreadyExist",
	"ReferralCodeInvalid",
	"ReferralProgramIsNotEnabled",
	"ReferralCodeAlreadyApplied",
]);

// Union of all error codes
export const ExtendedErrorCodeSchema = z.union([
	GeneralErrorCodeSchema,
	MarketAssetAccountErrorCodeSchema,
	LeverageErrorCodeSchema,
	StarkExErrorCodeSchema,
	OrderErrorCodeSchema,
	AccountErrorCodeSchema,
	WithdrawalErrorCodeSchema,
	TransferErrorCodeSchema,
	ReferralErrorCodeSchema,
]);

// Error response structure
export const ExtendedErrorSchema = z.object({
	/** Error code from the Extended API */
	code: ExtendedErrorCodeSchema,
	/** Descriptive error message */
	message: z.string(),
});

// Standard API error response format
export const ExtendedErrorResponseSchema = z.object({
	/** Response status - always "ERROR" */
	status: z.literal("ERROR"),
	/** Error details */
	error: ExtendedErrorSchema,
});
