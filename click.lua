-- We need this so user can calculate how much time it will take him to get the mastery for next rank.. all we need from this is the click per milisec with Fast click and slow click. 

local u1 = 0
return function(u2) --[[Anonymous function at line 7]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    shared.Reply.Connect("On Hit", function(p3) --[[Anonymous function at line 18]]
        --[[
        Upvalues:
            [1] = u2
        --]]
        u2.PlayWeapon(u2.Enemies[p3])
    end)
    shared.Reply.Connect("Attacked An Enemy", function(p4, p5, p6) --[[Anonymous function at line 22]]
        --[[
        Upvalues:
            [1] = u2
        --]]
        local v7 = u2.Enemies[p4]
        if v7 then
            v7:TakeDamage()
            u2.CreateDamageBillboard(v7.Root, p5, p6)
            u2.Sound.Variate.Effect("Hit")
        end
    end)
    u2.Started:Connect(function() --[[Anonymous function at line 33]]
        --[[
        Upvalues:
            [1] = u2
            [2] = u1
        --]]
        shared.Beat(0.03, function() --[[Anonymous function at line 35]]
            --[[
            Upvalues:
                [1] = u2
                [2] = u1
            --]]
            if u2.Data.Settings.AutoClick then
                local v8 = os.clock()
                if v8 - u1 >= 0.03 then
                    u1 = v8
                    local v9 = u2.EnemyTarget
                    local v10 = shared.Reply.UnTo
                    local v11 = "Hit"
                    local v12 = v9 and v9.Alive
                    if v12 then
                        v12 = v9.Uid
                    end
                    v10(v11, v12)
                end
            else
                return
            end
        end)
        _G.UIS.InputBegan:Connect(function(p13, p14) --[[Anonymous function at line 41]]
            --[[
            Upvalues:
                [1] = u2
                [2] = u1
            --]]
            if p14 then
                return
            elseif u2.Character then
                if not u2.Data.Settings.AutoClick then
                    if p13.UserInputType == Enum.UserInputType.Touch or (p13.UserInputType == Enum.UserInputType.MouseButton1 or p13.KeyCode == Enum.KeyCode.ButtonR2) then
                        local v15 = os.clock()
                        if v15 - u1 < 0.03 then
                            return
                        end
                        u1 = v15
                        local v16 = u2.EnemyTarget
                        local v17 = shared.Reply.UnTo
                        local v18 = "Hit"
                        local v19 = v16 and v16.Alive
                        if v19 then
                            v19 = v16.Uid
                        end
                        v17(v18, v19)
                    end
                end
            else
                return
            end
        end)
    end)
    u2.PreStarted:Connect(function() --[[Anonymous function at line 52]]
        --[[
        Upvalues:
            [1] = u2
        --]]
        local u20 = require(u2.Player.PlayerScripts.PlayerModule)
        function u2.ToggleControls(p21) --[[Anonymous function at line 55]]
            --[[
            Upvalues:
                [1] = u20
            --]]
            u20.controls:Enable(p21)
        end
    end)
end
