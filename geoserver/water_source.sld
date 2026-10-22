<?xml version="1.0" encoding="UTF-8"?>
<!-- WMS'in su kaynaklarını sunucu tarafında nasıl çizeceğini tanımlar (tipe göre renk). -->
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
          <Name>DAM</Name>
          <Title>Baraj</Title>
          <ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>source_type</ogc:PropertyName><ogc:Literal>DAM</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>
          <PointSymbolizer><Graphic><Mark><WellKnownName>square</WellKnownName>
            <Fill><CssParameter name="fill">#1565c0</CssParameter></Fill>
            <Stroke><CssParameter name="stroke">#ffffff</CssParameter><CssParameter name="stroke-width">1.5</CssParameter></Stroke>
          </Mark><Size>16</Size></Graphic></PointSymbolizer>
        </Rule>
        <Rule>
          <Name>SPRING</Name>
          <Title>Pınar</Title>
          <ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>source_type</ogc:PropertyName><ogc:Literal>SPRING</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>
          <PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName>
            <Fill><CssParameter name="fill">#00acc1</CssParameter></Fill>
            <Stroke><CssParameter name="stroke">#ffffff</CssParameter><CssParameter name="stroke-width">1.5</CssParameter></Stroke>
          </Mark><Size>14</Size></Graphic></PointSymbolizer>
        </Rule>
        <Rule>
          <Name>WELL</Name>
          <Title>Kuyu</Title>
          <ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>source_type</ogc:PropertyName><ogc:Literal>WELL</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>
          <PointSymbolizer><Graphic><Mark><WellKnownName>triangle</WellKnownName>
            <Fill><CssParameter name="fill">#6d4c41</CssParameter></Fill>
            <Stroke><CssParameter name="stroke">#ffffff</CssParameter><CssParameter name="stroke-width">1.5</CssParameter></Stroke>
          </Mark><Size>14</Size></Graphic></PointSymbolizer>
        </Rule>
        <Rule>
          <Name>RESERVOIR</Name>
          <Title>Depo</Title>
          <ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>source_type</ogc:PropertyName><ogc:Literal>RESERVOIR</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>
          <PointSymbolizer><Graphic><Mark><WellKnownName>star</WellKnownName>
            <Fill><CssParameter name="fill">#2e7d32</CssParameter></Fill>
            <Stroke><CssParameter name="stroke">#ffffff</CssParameter><CssParameter name="stroke-width">1.5</CssParameter></Stroke>
          </Mark><Size>16</Size></Graphic></PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
