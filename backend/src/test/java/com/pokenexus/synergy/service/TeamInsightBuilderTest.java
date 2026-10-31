package com.pokenexus.synergy.service;

import static com.pokenexus.synergy.service.SynergyFixture.EXAMPLE_TEAM;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonCatalogEntry;
import com.pokenexus.pokedex.dto.Stats;
import com.pokenexus.synergy.dto.AnalyzeResponse.InsightCategory;
import com.pokenexus.synergy.dto.AnalyzeResponse.InsightTone;
import com.pokenexus.synergy.dto.AnalyzeResponse.TeamInsight;

class TeamInsightBuilderTest {

    private final SynergyAnalyzer analyzer = SynergyFixture.analyzer();

    @Test
    void listsStrengthsBeforeWeaknessesForTheSpecExampleTeam() {
        List<TeamInsight> insights = analyzer.analyze(EXAMPLE_TEAM).insights();

        assertThat(insights).extracting(TeamInsight::text).contains(
                "3 thành viên nhanh (tốc độ gốc từ 100)",
                "Lỗ hổng nghiêm trọng hệ Rock: 5 thành viên yếu, không ai kháng",
                "Lỗ hổng nghiêm trọng hệ Electric: 3 thành viên yếu, không ai kháng",
                "4 thành viên cùng hệ Flying: dễ bị một hệ tấn công khắc chế");
        assertThat(insights).extracting(TeamInsight::text).doesNotContain("Không có lỗ hổng nghiêm trọng");
        assertThat(insights).extracting(TeamInsight::tone).isSorted();
        assertThat(insights).filteredOn(insight -> insight.text().startsWith("Lỗ hổng nghiêm trọng hệ Rock"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.category()).isEqualTo(InsightCategory.DEFENSE);
                    assertThat(insight.types()).containsExactly("rock");
                });
    }

    @Test
    void flagsAnAllPhysicalTeam() {
        List<TeamInsight> insights = analyzer.analyze(List.of(445, 530, 248, 130)).insights();

        assertThat(insights).filteredOn(insight -> insight.tone() == InsightTone.WEAKNESS)
                .extracting(TeamInsight::text)
                .contains("Chỉ có sát thương vật lý: một đối thủ Phòng thủ cao có thể chặn cả đội");
    }

    @Test
    void warnsWhenNoMemberIsFast() {
        List<TeamInsight> insights = analyzer.analyze(List.of(260, 248, 376, 530)).insights();

        assertThat(insights).extracting(TeamInsight::text)
                .contains("Chưa có thành viên nhanh (tốc độ gốc từ 100): dễ bị đánh trước");
    }

    @Test
    void recognisesASlowTrickRoomTeam() {
        List<PokemonCatalogEntry> slowCatalog = List.of(
                slow(80, "slowbro", List.of(PokemonType.WATER, PokemonType.PSYCHIC),
                        new Stats(95, 75, 110, 100, 80, 30)),
                slow(143, "snorlax", List.of(PokemonType.NORMAL), new Stats(160, 110, 65, 65, 110, 30)),
                slow(579, "reuniclus", List.of(PokemonType.PSYCHIC), new Stats(110, 65, 75, 125, 85, 30)));
        PokemonProfileRegistry registry = SynergyFixture.registry(SynergyFixture.typeChart(), slowCatalog);
        SynergyAnalyzer slowAnalyzer = new SynergyAnalyzer(registry, new TeamInsightBuilder());

        List<TeamInsight> insights = slowAnalyzer.analyze(List.of(80, 143, 579)).insights();

        assertThat(insights).extracting(TeamInsight::text)
                .contains("Đội chậm, hợp lối chơi Trick Room (tốc độ gốc trung bình 30)")
                .doesNotContain("Chưa có thành viên nhanh (tốc độ gốc từ 100): dễ bị đánh trước");
    }

    @Test
    void keepsOnlyTypeInsightsForATeamOfTwo() {
        List<TeamInsight> insights = analyzer.analyze(List.of(6, 130)).insights();

        assertThat(insights).extracting(TeamInsight::category)
                .doesNotContain(InsightCategory.SPEED, InsightCategory.BALANCE);
        assertThat(insights).extracting(TeamInsight::text).doesNotContain("Không có lỗ hổng nghiêm trọng");
    }

    private static PokemonCatalogEntry slow(int id, String name, List<PokemonType> types, Stats stats) {
        int total = stats.hp() + stats.attack() + stats.defense() + stats.specialAttack() + stats.specialDefense()
                + stats.speed();
        return new PokemonCatalogEntry(id, name, types, FormCategory.DEFAULT, false, false, true, stats, total);
    }
}
