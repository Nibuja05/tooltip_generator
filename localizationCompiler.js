"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizationCompiler = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var localizationInterfaces_1 = require("./localizationInterfaces");
var LocalizationCompiler = /** @class */ (function () {
    function LocalizationCompiler() {
        this.addon_filepath = path.join("node_modules/~resource", "addon_");
        this.filepath_format = ".txt";
    }
    // Helper functions
    LocalizationCompiler.prototype.TransformForLocalization = function (text, modifier) {
        if (modifier) {
            return text.replace(/\{([^f]\w+)\}($|[^%])/g, "%d$1%$2").replace(/\{([^f]\w+)\}%/g, "%d$1%%%").replace(/\{f(\w+)\}($|[^%])/g, "%f$1%$2").replace(/\{f(\w+)\}%/g, "%f$1%%%");
        }
        else {
            return text.replace(/\${(\w*)}($|[^%])/g, "%$1%$2").replace(/\${(\w*)}%/g, "%$1%%%");
        }
    };
    LocalizationCompiler.prototype.OnLocalizationDataChanged = function (allData) {
        // console.log("Localization event fired");
        var Abilities = new Array();
        var Modifiers = new Array();
        var StandardTooltips = new Array();
        //let Talents: Array<HeroTalents> = new Array<HeroTalents>();
        var localization_info = {
            AbilityArray: Abilities,
            ModifierArray: Modifiers,
            StandardArray: StandardTooltips,
        };
        for (var _i = 0, _a = Object.entries(allData); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], data = _b[1];
            if (data.AbilityArray) {
                Array.prototype.push.apply(Abilities, data.AbilityArray);
            }
            if (data.ModifierArray) {
                Array.prototype.push.apply(Modifiers, data.ModifierArray);
            }
            if (data.StandardArray) {
                Array.prototype.push.apply(StandardTooltips, data.StandardArray);
            }
            // if (data.TalentArray) {
            //     Array.prototype.push.apply(Talents, data.TalentArray);
            // }
        }
        // console.log("Localization data generated");
        // Generate information for every language
        var languages = Object.values(localizationInterfaces_1.Language).filter(function (v) { return typeof v !== "number"; });
        for (var _c = 0, languages_1 = languages; _c < languages_1.length; _c++) {
            var language = languages_1[_c];
            var localization_content = this.GenerateContentStringForLanguage(language, localization_info);
            this.WriteContentToAddonFile(language, localization_content);
        }
    };
    LocalizationCompiler.prototype.GenerateContentStringForLanguage = function (language, localized_data) {
        var localization_content = "";
        // Go over standard tooltips
        if (localized_data.StandardArray) {
            for (var _i = 0, _a = localized_data.StandardArray; _i < _a.length; _i++) {
                var standardLocalization = _a[_i];
                // Check for name override for the language we're checking
                var standard_tooltip_string = standardLocalization.name;
                if (standardLocalization.language_overrides && standardLocalization.language_overrides.length > 0) {
                    for (var _b = 0, _c = standardLocalization.language_overrides; _b < _c.length; _b++) {
                        var language_override = _c[_b];
                        if (language_override.language === language) {
                            standard_tooltip_string = language_override.name_override;
                        }
                    }
                }
                localization_content += "\t\t\"" + standardLocalization.classname + "\" \"" + standard_tooltip_string + "\"";
                localization_content += "\n";
            }
        }
        // Go over abilities for this language
        if (localized_data.AbilityArray) {
            for (var _d = 0, _e = localized_data.AbilityArray; _d < _e.length; _d++) {
                var ability = _e[_d];
                // Class name is identical for all languages, so we would always use it
                var ability_string = "\t\t\"DOTA_Tooltip_Ability_" + ability.ability_classname;
                // Name
                var ability_name = ability.name;
                var ability_description = ability.description;
                //let reimagined_effects = ability.reimagined_effects;
                var ability_lore = ability.lore;
                var ability_notes = ability.notes;
                var scepter_description = ability.scepter_description;
                var shard_description = ability.shard_description;
                var ability_specials = ability.ability_specials;
                if (ability.language_overrides) {
                    for (var _f = 0, _g = ability.language_overrides; _f < _g.length; _f++) {
                        var language_override = _g[_f];
                        if (language_override.language === language) {
                            // Check for name override
                            if (language_override.name_override) {
                                ability_name = language_override.name_override;
                            }
                            // Check for description overrides
                            if (language_override.description_override) {
                                ability_description = language_override.description_override;
                            }
                            // Check for reimagined effect overrides
                            // if (language_override.reimagined_effects_override)
                            // {
                            //     reimagined_effects = language_override.reimagined_effects_override;
                            // }
                            // Check for lore override
                            if (language_override.lore_override) {
                                ability_lore = language_override.lore_override;
                            }
                            // Check for note override
                            if (language_override.notes_override) {
                                ability_notes = language_override.notes_override;
                            }
                            // Check for scepter override
                            if (language_override.scepter_description_override) {
                                scepter_description = language_override.scepter_description_override;
                            }
                            // Check for shard override
                            if (language_override.shard_description_override) {
                                shard_description = language_override.shard_description_override;
                            }
                            // Check for ability specials override, if any
                            if (language_override.ability_specials_override) {
                                ability_specials = language_override.ability_specials_override;
                            }
                        }
                    }
                }
                // Add name localization
                if (ability_name) {
                    localization_content += ability_string + "\" \"" + ability_name + "\"";
                    localization_content += "\n";
                }
                // Add description localization
                if (ability_description) {
                    ability_description = this.TransformForLocalization(ability_description, false);
                    localization_content += ability_string + "_description\" \"" + ability_description + "\"";
                    localization_content += "\n";
                }
                // // Reimagined effects, if any
                // if (reimagined_effects)
                // {
                //     let counter = 1;
                //     for (const reimagined_effect of reimagined_effects)
                //     {
                //         // Reimagined title
                //         localization_content += `${ability_string}_rmg_title_${counter}" "${reimagined_effect.title}"`;
                //         localization_content += "\n";
                //         // Reimagined description
                //         const reimagined_effect_description = this.TransformForLocalization(reimagined_effect.description, false);
                //         localization_content += `${ability_string}_rmg_description_${counter}" "${reimagined_effect_description}"`;
                //         localization_content += "\n";
                //         counter++;
                //     }
                // }
                // Lore, if any
                if (ability_lore) {
                    var transformed_lore = this.TransformForLocalization(ability_lore, false);
                    localization_content += ability_string + "_Lore\" \"" + transformed_lore + "\"";
                    localization_content += "\n";
                }
                // Notes, if any
                if (ability_notes) {
                    var counter = 0;
                    for (var _h = 0, ability_notes_1 = ability_notes; _h < ability_notes_1.length; _h++) {
                        var note = ability_notes_1[_h];
                        var transformed_note = this.TransformForLocalization(note, false);
                        localization_content += ability_string + "_Note" + counter + "\" \"" + transformed_note + "\"";
                        localization_content += "\n";
                        counter++;
                    }
                }
                // Scepter, if any
                if (scepter_description) {
                    var ability_scepter_description = this.TransformForLocalization(scepter_description, false);
                    localization_content += ability_string + "_scepter_description\" \"" + ability_scepter_description + "\"";
                    localization_content += "\n";
                }
                // Shard, if any
                if (shard_description) {
                    var ability_shard_description = this.TransformForLocalization(shard_description, false);
                    localization_content += ability_string + "_shard_description\" \"" + ability_shard_description + "\"";
                    localization_content += "\n";
                }
                // Ability specials, if any
                if (ability_specials) {
                    for (var _j = 0, ability_specials_1 = ability_specials; _j < ability_specials_1.length; _j++) {
                        var ability_special = ability_specials_1[_j];
                        // Construct the ability special
                        var ability_special_text = "";
                        if (ability_special.percentage) {
                            ability_special_text = "%";
                        }
                        else if (ability_special.item_stat) {
                            ability_special_text = "+$";
                        }
                        ability_special_text += ability_special.text;
                        localization_content += ability_string + "_" + ability_special.ability_special + "\" \"" + ability_special_text + ":\"";
                        localization_content += "\n";
                    }
                }
            }
        }
        // Go over talents for that language
        // if (localized_data.TalentArray) {
        //     for (const hero_talent_list of localized_data.TalentArray)
        //     {
        //         const talent_classname = `\t\t"DOTA_Tooltip_Ability_${hero_talent_list.talent_classname}`;
        //         let talent_counter = 1;
        //         for (const talent of hero_talent_list.talents)
        //         {
        //             let talent_name = talent.name;
        //             let talent_description = talent.description;
        //             let talent_lore = talent.lore;
        //             if (talent.language_overrides)
        //             {
        //                 for (const language_override of talent.language_overrides)
        //                 {
        //                     // Only do overrides for the language that we're checking right now
        //                     if (language_override.language === language)
        //                     {
        //                         // Check name override
        //                         if (language_override.name_override)
        //                         {
        //                             talent_name = language_override.name_override;
        //                         }
        //                         // Check description override
        //                         if (language_override.description_override)
        //                         {
        //                             talent_description = language_override.description_override;
        //                         }
        //                         // Check lore override
        //                         if (language_override.lore_override)
        //                         {
        //                             talent_lore = language_override.lore_override;
        //                         }
        //                     }
        //                 }
        //             }
        //             // Talent name
        //             const talent_string = `${talent_classname}_${talent_counter}`;
        //             localization_content += `${talent_string}" "${talent_name}"`
        //             localization_content += "\n";
        //             // Talent description
        //             talent_description = this.TransformForLocalization(talent_description, false);
        //             localization_content += `${talent_string}_Description" "${talent_description}"`
        //             localization_content += "\n";
        //             // Talent lore
        //             localization_content += `${talent_string}_Lore" "${talent_lore}"`
        //             localization_content += "\n";
        //             // Increment talent counter
        //             talent_counter++;
        //         }
        //     }
        // }
        // Go over modifiers
        if (localized_data.ModifierArray) {
            for (var _k = 0, _l = localized_data.ModifierArray; _k < _l.length; _k++) {
                var modifier = _l[_k];
                var modifier_string = "\t\t\"DOTA_Tooltip_" + modifier.modifier_classname;
                // Name
                var modifier_name = modifier.name;
                var modifier_description = modifier.description;
                if (modifier.language_overrides) {
                    for (var _m = 0, _o = modifier.language_overrides; _m < _o.length; _m++) {
                        var language_override = _o[_m];
                        if (language_override.language === language) {
                            // Name overrides for a specific language, if necessary
                            if (language_override.name_override) {
                                modifier_name = language_override.name_override;
                            }
                            // Description overrides for a specific language, if necessary
                            if (language_override.description_override) {
                                modifier_description = language_override.description_override;
                            }
                        }
                    }
                }
                // Add name to localization string
                if (modifier_name) {
                    localization_content += modifier_string + "\" \"" + modifier_name + "\"";
                    localization_content += "\n";
                }
                // Add description to localization string
                if (modifier_description) {
                    modifier_description = this.TransformForLocalization(modifier_description, true);
                    localization_content += modifier_string + "_description\" \"" + modifier_description + "\"";
                    localization_content += "\n";
                }
            }
        }
        return localization_content;
    };
    LocalizationCompiler.prototype.WriteContentToAddonFile = function (language, localization_content) {
        // Set based on language
        var filepath = this.addon_filepath + language.toString() + this.filepath_format;
        // Remove file contents, or create a fresh one if it doesn't exists yet.
        var fd = fs.openSync(filepath, 'w');
        fs.closeSync(fd);
        // Add the opening tokens
        var localization_intro = "\"lang\"\n{\n\t\"Language\" \"" + language + "\"\n\t\"Tokens\"\n\t{\n";
        // Add the closing token
        var localization_ending = '\t}\n}';
        var write_string = localization_intro + localization_content + localization_ending;
        // Write to the file
        var fileName = "addon_" + language.toString() + this.filepath_format;
        fs.writeFile(filepath, write_string, function () { console.log("\x1b[36m%s\x1b[0m", "Finished writing tooltips for language " + language + " in file " + fileName); });
    };
    return LocalizationCompiler;
}());
exports.LocalizationCompiler = LocalizationCompiler;
