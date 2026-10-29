param(
    [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if ($OutDir -eq "") {
    $OutDir = Join-Path (Split-Path -Parent $PSScriptRoot) "data/csv"
}
$PokeApiCommit = "e2710d30d14b3f4dc6a02a4a71e8619cd835b7ff"
$BaseUrl = "https://raw.githubusercontent.com/PokeAPI/pokeapi/$PokeApiCommit/data/v2/csv"
$Files = @("types", "type_efficacy", "regions", "generations", "evolution_chains", "pokemon_species", "pokemon", "pokemon_types", "pokemon_stats", "stats", "pokemon_evolution", "evolution_triggers")

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
foreach ($Name in $Files) {
    $Target = Join-Path $OutDir "$Name.csv"
    Invoke-WebRequest -UseBasicParsing -Uri "$BaseUrl/$Name.csv" -OutFile "$Target.part"
    Move-Item -Force "$Target.part" $Target
}

Write-Output "Downloaded $($Files.Count) files from PokeAPI commit $($PokeApiCommit.Substring(0, 7)) into $OutDir"
Get-ChildItem $OutDir
