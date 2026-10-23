param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][int]$Width
)

Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile($Path)
$rect = New-Object System.Drawing.Rectangle 0, 0, $Width, $source.Height
$target = New-Object System.Drawing.Bitmap $Width, $source.Height
$graphics = [System.Drawing.Graphics]::FromImage($target)
$graphics.DrawImage($source, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.Dispose()
$source.Dispose()
$target.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
$target.Dispose()
