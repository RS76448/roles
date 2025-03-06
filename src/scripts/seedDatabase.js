"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/scripts/seedDatabase.ts
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
var Feature_1 = require("@models/Feature");
var Location_1 = require("@models/Location");
var locationHierarchyHelper_1 = require("@utils/locationHierarchyHelper");
// Load environment variables
dotenv_1.default.config();
var seedDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mongoUri, features, createLocationHierarchy, level1, level2, level3, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/role_management';
                return [4 /*yield*/, mongoose_1.default.connect(mongoUri)];
            case 1:
                _a.sent();
                console.log('Connected to database for seeding');
                features = [
                    { name: 'Feature_1', description: 'First Feature' },
                    { name: 'Feature_2', description: 'Second Feature' },
                    { name: 'Feature_3', description: 'Third Feature' },
                    { name: 'Feature_4', description: 'Fourth Feature' },
                    { name: 'Feature_5', description: 'Fifth Feature' }
                ];
                // Clear existing features
                return [4 /*yield*/, Feature_1.default.deleteMany({})];
            case 2:
                // Clear existing features
                _a.sent();
                return [4 /*yield*/, Feature_1.default.insertMany(features)];
            case 3:
                _a.sent();
                console.log('Features seeded successfully');
                // Clear existing locations
                return [4 /*yield*/, Location_1.default.deleteMany({})];
            case 4:
                // Clear existing locations
                _a.sent();
                createLocationHierarchy = function (name, level, parentId) { return __awaiter(void 0, void 0, void 0, function () {
                    var location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, locationHierarchyHelper_1.LocationHierarchyHelper.createLocationHierarchy({
                                    name: name,
                                    level: level,
                                    parentId: parentId
                                })];
                            case 1:
                                location = _a.sent();
                                return [2 /*return*/, new mongoose_1.default.Types.ObjectId(location._id + "")];
                        }
                    });
                }); };
                return [4 /*yield*/, createLocationHierarchy('Country', 1)];
            case 5:
                level1 = _a.sent();
                return [4 /*yield*/, createLocationHierarchy('State', 2, level1.toString())];
            case 6:
                level2 = _a.sent();
                return [4 /*yield*/, createLocationHierarchy('City', 3, level2.toString())];
            case 7:
                level3 = _a.sent();
                console.log('Location hierarchy seeded successfully');
                // Disconnect after seeding
                return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 8:
                // Disconnect after seeding
                _a.sent();
                console.log('Seeding completed successfully');
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                console.error('Seeding error:', error_1);
                process.exit(1);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
// Run the seeding script
seedDatabase();
