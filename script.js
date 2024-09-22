async function getCharacterInfo() {
    const characterName = document.getElementById('characterName').value;
    const resultDiv = document.getElementById('result');

    if (!characterName) {
        resultDiv.innerHTML = '캐릭터명을 입력하세요.';
        return;
    }

    try {
        const encodedApiKey = 'bGl2ZV84NTEyNDZjYzg0NDUyOGEzYWU2ZTViNjNmNTdhYmExNzAwODc2MDU0YjU0MzZmYzQ3MTE5ZjcyZGE4NDY0ZGU5ZWZlOGQwNGU2ZDIzM2JkMzVjZjJmYWJkZWI5M2ZiMGQ=';

        // 첫 번째 API 호출: 캐릭터 식별자 가져오기
        const idResponse = await fetch(`https://open.api.nexon.com/heroes/v2/id?character_name=${characterName}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': atob(encodedApiKey)
            }
        });
        if (!idResponse.ok) {
            throw new Error('캐릭터 식별자를 찾을 수 없습니다.');
        }
        const idData = await idResponse.json();
        const ocid = idData.ocid;
        if (!ocid) {
            throw new Error('식별자가 없습니다.');
        }

        // 두 번째 API 호출: 캐릭터 기본 정보 가져오기
        const infoResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/basic?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': atob(encodedApiKey)
            }
        });
        const infoData = await infoResponse.json();

        // 세 번째 API 호출: 캐릭터 능력치 정보 가져오기
        const statResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/stat?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': atob(encodedApiKey)
            }
        });
        const statData = await statResponse.json();

        // 네 번째 API 호출: 길드 정보 가져오기
        const guildResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/guild?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': atob(encodedApiKey)
            }
        });
        const guildData = await guildResponse.json();

        // 다섯 번째 API 호출: 장착 타이틀 가져오기
        const titleResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/title-equipment?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': atob(encodedApiKey)
            }
        });
        const titleData = await titleResponse.json();

        // 여섯 번째 API 호출: 캐릭터 능력치 정보 가져오기
        const itemResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/item-equipment?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': atob(encodedApiKey)
            }
        });
        const itemData = await itemResponse.json();



     

        // 능력치 데이터를 정리하여 원하는 형식으로 출력
        const statMap = {};
        statData.stat.forEach(stat => {
            statMap[stat.stat_name] = stat.stat_value;
        });

        // 포맷에 맞게 능력치 정리
        let formattedStats = `
            힘: ${statMap['힘']}     공격력: ${statMap['공격력']}<br>
            민첩: ${statMap['민첩']}     방어력: ${statMap['방어력']}<br>
            지능: ${statMap['지능']}     크리티컬: ${statMap['크리티컬']}<br>
            의지: ${statMap['의지']}     크리티컬 피해량: ${statMap['크리티컬 피해량']}<br>
            행운: ${statMap['행운']}     크리티컬 저항: ${statMap['크리티컬 저항']}<br>
            최대 생명력: ${statMap['최대 생명력']}     추가 피해: ${statMap['추가피해']}<br>
            최대 스태미나: ${statMap['최대 스태미나']}     대항력: ${statMap['대항력']}<br>
            밸런스: ${statMap['밸런스']}<br>
            공격속도: ${statMap['공격속도']}<br>
            공격력 제한 해제: ${statMap['공격력 제한 해제']}<br><br>
        `;

        // 날짜 형식 변경 함수
        function formatDate(dateString) {
            const date = new Date(dateString);
            if (isNaN(date.getTime()) || !dateString) {
                return '정보 없음 (혹은 오래전)';
            }
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}. ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }

        // 스킬 각성 정보 처리
        const skillAwakening = infoData.skill_awakening.length > 0
            ? infoData.skill_awakening.map(skill => {
                const itemName = skill.item_name.replace('각성의 돌:', '').trim();
                return `<div class="flex">
                         <span class="ll">${skill.skill_name}</span>
                         <div class="dot"></div>
                         <span class="rr">${itemName}</span>
                    </div>`;
            }).join('<br>')
            : '정보 없음';
debugger
        // 장비 정보
        var EquipitemData = [``,``,``,``,``,``,``,``,``,``,``,``,``,``,``,``,``]
        var Equiphead = [`Earring`,`Right Hand`,`Belt`,`Right Finger`,`Right Wrist`,`Head`,`Upper`,`Lower`,`Leg`,`Artifact`,`Rhod`,`Necklace`,`Left Hand`,`Hand`,`Charm`,`Left Finger`,`Left Wrist`]
        var iter = 0;
        while (iter<17) {
            
            var itemTemp = itemData.item_equipment.find(item => item && item.item_equipment_slot_name === Equiphead[iter]);
            if (itemTemp) {
            
                
            switch (iter) {
                case 4:
                case 9:
                case 10:
                case 16:
                    EquipitemData[iter] = EquipitemData[iter] + `<span class="select opac">없음</span><br>`;
                    break;
                default:
            if (itemTemp?.item_option?.power_infusion_use_preset_no === 1) {
                EquipitemData[iter] = EquipitemData[iter] + `
                <span class="select">&nbsp${itemTemp?.item_option?.power_infusion_preset_1?.stat_name ?? '없음'} +${itemTemp?.item_option?.power_infusion_preset_1?.stat_value ?? '0'}&nbsp</span>&nbsp
                <span class="nosel">&nbsp${itemTemp?.item_option?.power_infusion_preset_2?.stat_name ?? '없음'} +${itemTemp?.item_option?.power_infusion_preset_2?.stat_value ?? '0'}&nbsp</span><br>
                `
            }
            else if (itemTemp?.item_option?.power_infusion_use_preset_no === 2) {
                EquipitemData[iter] = EquipitemData[iter] + `
                <span class="nosel">&nbsp${itemTemp?.item_option?.power_infusion_preset_1?.stat_name ?? '없음'} +${itemTemp?.item_option?.power_infusion_preset_1?.stat_value ?? '0'}&nbsp</span>&nbsp
                <span class="select">&nbsp${itemTemp?.item_option?.power_infusion_preset_2?.stat_name ?? '없음'} +${itemTemp?.item_option?.power_infusion_preset_2?.stat_value ?? '0'}&nbsp</span><br>
                `
            }
            else {EquipitemData[iter] = EquipitemData[iter] + `<span class="select opac">없음</span><br>`}
            }

            switch (iter) {
                case 4:
                case 16:
                    EquipitemData[iter] = EquipitemData[iter] + `<span class="select opac">없음</span><br>`;
                    break;
                default:
            if (itemTemp.item_option?.prefix_enchant_use_preset_no === 1) {
                EquipitemData[iter] = EquipitemData[iter] + `
                <span class="select">&nbsp${itemTemp?.item_option?.prefix_enchant_preset_1 ?? '없음'}&nbsp</span>&nbsp
                <span class="nosel">&nbsp${itemTemp?.item_option?.prefix_enchant_preset_2 ?? '없음'}&nbsp</span><br>
                `
            }
            else if (itemTemp.item_option?.prefix_enchant_use_preset_no === 2) {
                EquipitemData[iter] = EquipitemData[iter] + `
                <span class="nosel">&nbsp${itemTemp?.item_option?.prefix_enchant_preset_1 ?? '없음'}&nbsp</span>&nbsp
                <span class="select">&nbsp${itemTemp?.item_option?.prefix_enchant_preset_2 ?? '없음'}&nbsp</span><br>
                `
            }
            else {EquipitemData[iter] = EquipitemData[iter] + `<span class="select opac">없음</span><br>`}
            }

            switch (iter) {
                case 4:
                case 16:
                    EquipitemData[iter] = EquipitemData[iter] + `<span class="select opac">없음</span><br>`;
                    break;
                default:
            if (itemTemp.item_option?.suffix_enchant_use_preset_no === 1) {
                EquipitemData[iter] = EquipitemData[iter] + `
                <span class="select">&nbsp${itemTemp?.item_option?.suffix_enchant_preset_1 ?? '없음'}&nbsp</span>&nbsp
                <span class="nosel">&nbsp${itemTemp?.item_option?.suffix_enchant_preset_2 ?? '없음'}&nbsp</span><br>
                `
            } else if (itemTemp.item_option?.suffix_enchant_use_preset_no === 2) {
                EquipitemData[iter] = EquipitemData[iter] + `
                <span class="nosel">&nbsp${itemTemp?.item_option?.suffix_enchant_preset_1 ?? '없음'}&nbsp</span>&nbsp
                <span class="select">&nbsp${itemTemp?.item_option?.suffix_enchant_preset_2 ?? '없음'}&nbsp</span><br>
                `
            } else {EquipitemData[iter] = EquipitemData[iter] + `<span class="select opac">없음</span><br>`}
            }   

            if (itemTemp?.item_option?.enhancement_level != null) {
                EquipitemData[iter] = EquipitemData[iter] + `+<span class="bold">${itemTemp?.item_option?.enhancement_level ?? ''} ${itemTemp?.item_name ?? '미착용'}</span><br>` 
            }
            else {
                EquipitemData[iter] = EquipitemData[iter] + `<span class="bold">${itemTemp?.item_name ?? '미착용'}</span><br>`
            }
            
            } else {EquipitemData[iter] = `<span class="gray"><br><br>장비없음<br><br></span>`};
        iter = iter + 1;
        
        }
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/밸런스/g,`밸런`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/크리티컬 저항/g,`크저`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/크리티컬/g,`크리`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/공격속도/g,`공속`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/마법공격력/g,`마공`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/공격력/g,`물공`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/방어력/g,`방어`);});
        EquipitemData = EquipitemData.map(ment => {return ment.replace(/\+\-/g,`-`);});
        // 장비 구멍 있으면 밀려버리는 버그를 고쳐야함
            
        // 결과 형식화
        let formattedResult = `
            <div class="grid-container">
            <div class="grid-item">
            <div class="inner_border">
            <div class="title1">=&nbsp;&nbsp;&nbsp;기본정보&nbsp;&nbsp;&nbsp;=</div><br>
            <div class="flex"><span class="ll">캐릭터</span><div class="dot"></div><span class="rr">${infoData.character_name} (${infoData.character_class_name})</span></div><br>
            <div class="flex"><span class="ll">카르제</span><div class="dot"></div><span class="rr">${infoData.cairde_name}</span></div><br>
            <div class="flex"><span class="ll">길드명</span><div class="dot"></div><span class="rr">${guildData.guild_name}</span></div><br>
            <div class="flex"><span class="ll">타이틀 수</span><div class="dot"></div><span class="rr">${infoData.total_title_count}</span></div><br>
            <div class="flex"><span class="ll">장착 타이틀</span><div class="dot"></div><span class="rr">${titleData.title_equipment[0]?.title_name??'없음'}</span></div><br>
            <div class="flex"><span class="ll">생성 일자</span><div class="dot"></div><span class="rr">${formatDate(infoData.character_date_create)}</span></div><br>
            <div class="flex"><span class="ll">마지막 로그인</span><div class="dot"></div><span class="rr">${formatDate(infoData.character_date_last_login)}</span></div><br>
            <div class="flex"><span class="ll">마지막 로그아웃</span><div class="dot"></div><span class="rr">${formatDate(infoData.character_date_last_logout)}</span></div><br></div>
            <br>

            <div class="inner_border border2">
            <div class="title1">=&nbsp;&nbsp;&nbsp;능력치 정보&nbsp;&nbsp;&nbsp;=</div><br>
            <div class="flex"><span class="ll">힘: ${statMap['힘']}</span><span class="rr redbold">공격력: ${statMap['공격력']}</span></div><br>
            <div class="flex"><span class="ll">민첩: ${statMap['민첩']}</span><span class="rr redbold">마법공격력: ${statMap['마법공격력']}</span></div><br>
            <div class="flex"><span class="ll">지능: ${statMap['지능']}</span><span class="rr">방어력: ${statMap['방어력']}</span></div><br>
            <div class="flex"><span class="ll">의지: ${statMap['의지']}</span><span class="rr redbold">크리티컬: ${statMap['크리티컬']}</span></div><br>
            <div class="flex"><span class="ll">행운: ${statMap['행운']}</span><span class="rr">크리티컬 피해량: ${statMap['크리티컬 피해량']}</span></div><br>
            <div class="flex"><span class="ll">최대 생명력: ${statMap['최대 생명력']}</span><span class="rr">크리티컬 저항: ${statMap['크리티컬 저항']}</span></div><br>
            <div class="flex"><span class="ll">최대 스태미나: ${statMap['최대 스태미나']}</span><span class="rr redbold">추가피해: ${statMap['추가피해']}</span></div><br>
            <div class="flex"><span class="ll redbold">밸런스: ${statMap['밸런스']}</span><span class="rr redbold">대항력: ${statMap['대항력']}</span></div><br>
            <div class="flex"><span class="ll redbold">공격속도: ${statMap['공격속도']}</span></div><br>
            <div class="flex"><span class="ll redbold">공격력 제한 해제: ${statMap['공격력 제한 해제']}</span></div><br></div>
            <br>
            </div>
            <div class="grid-item">
            <div class="inner_border border3">
            <div class="title1">=&nbsp;&nbsp;&nbsp;스킬 각성&nbsp;&nbsp;&nbsp;=</div><br>
            ${skillAwakening}<br>
            </div>
            </div>
            </div>
            <div class="inner_border border4">
            <div class="title1">=&nbsp;&nbsp;&nbsp;장비 정보&nbsp;&nbsp;&nbsp;=</div>
            <div class="gray">보급 장비의 정령작, 인챈트 정보는 표시되지 않습니다.</div>
            <div class="grid-container2">
            
            <div class="grid-item">
            <div class="inner_border border5 equipback2">${EquipitemData[0]}</div>
            <div class="inner_border border5">${EquipitemData[1]}</div>
            <div class="inner_border border5 equipback4"><span class="gray"><br><br>보조장비<br><br></span></div>
            <div class="inner_border border5 equipback2">${EquipitemData[2]}</div>
            <div class="inner_border border5 equipback2">${EquipitemData[3]}</div>
            <div class="inner_border border5 equipback1">${EquipitemData[4]}</div>
            </div>
            
            <div class="grid-item">
            <div class="inner_border border5">${EquipitemData[5]}</div>
            <div class="inner_border border5">${EquipitemData[6]}</div>
            <div class="inner_border border5">${EquipitemData[7]}</div>
            <div class="inner_border border5">${EquipitemData[8]}</div>
            <div class="inner_border border5 equipback3">${EquipitemData[9]}</div>
            <div class="inner_border border5 equipback3">${EquipitemData[10]}</div>
            </div>

            <div class="grid-item">
            <div class="inner_border border5 equipback3">${EquipitemData[11]}</div>
            <div class="inner_border border5 equipback3">${EquipitemData[12]}</div>
            <div class="inner_border border5">${EquipitemData[13]}</div>
            <div class="inner_border border5 equipback3">${EquipitemData[14]}</div>
            <div class="inner_border border5 equipback2">${EquipitemData[15]}</div>
            <div class="inner_border border5 equipback1">${EquipitemData[16]}</div>
            </div>

            </div>
            </div>
        `;

        resultDiv.innerHTML = formattedResult;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">에러: ${error.message}</p>`;
    }
}
