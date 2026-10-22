<?xml version="1.0" encoding="UTF-8"?>
<!-- WMS'in su kaynaklarını sunucu tarafında nasıl çizeceğini tanımlar. -->
<StyledLayerDescriptor version="1.0.0"
    xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>water_source</Name>
    <UserStyle>
      <Title>Su kaynakları</Title>
      <FeatureTypeStyle>
        <Rule>
          <Title>Su kaynağı</Title>
          <PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName>
            <Fill><CssParameter name="fill">#1565c0</CssParameter></Fill>
            <Stroke><CssParameter name="stroke">#ffffff</CssParameter><CssParameter name="stroke-width">1.5</CssParameter></Stroke>
          </Mark><Size>14</Size></Graphic></PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
