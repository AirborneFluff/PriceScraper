using API.Interfaces;
using API.Models;
using HtmlAgilityPack;

namespace API.Services;

public class JustKampersScraper(HttpClient httpClient) : IWebScraper
{
    private const string _baseUrl = "https://www.justkampers.com/catalogsearch/result/?q=";
    private readonly HttpClient _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));

    public async Task<List<ItemDetails>> GetItemDetails(string uniqueCode)
    {
        if (string.IsNullOrWhiteSpace(uniqueCode))
            throw new ArgumentException("Unique code cannot be null or empty", nameof(uniqueCode));

        var htmlContent = await FetchHtmlContentAsync(uniqueCode);
        if (string.IsNullOrEmpty(htmlContent)) return [];

        var document = new HtmlDocument();
        document.LoadHtml(htmlContent);

        var productNodes = document.DocumentNode.SelectNodes("//div[contains(@class, 'product-item-info')]");
        if (productNodes == null) return [];

        var matchingProducts = new List<ItemDetails>();
        foreach (var productNode in productNodes)
        {
            if (!TryExtractProductDetails(productNode, uniqueCode, out var itemDetails)) continue;
            if (itemDetails is null) continue;
            matchingProducts.Add(itemDetails);
        }

        return matchingProducts;
    }

    private async Task<string> FetchHtmlContentAsync(string uniqueCode)
    {
        try
        {
            var url = _baseUrl + uniqueCode;
            return await _httpClient.GetStringAsync(url);
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"Error fetching data: {e.Message}");
            return string.Empty;
        }
    }

    private bool TryExtractProductDetails(HtmlNode productNode, string uniqueCode, out ItemDetails? itemDetails)
    {
        itemDetails = null;

        string? productUniqueCode = null;
        foreach (var child in productNode.Descendants())
        {
            if (child.InnerText == null ||
                !child.InnerText.Contains(uniqueCode, StringComparison.OrdinalIgnoreCase) ||
                !child.GetClasses().Contains("amlabel-text")) continue;

            productUniqueCode = child.InnerText.Trim();
            break;
        }

        if (productUniqueCode == null)
        {
            return false;
        }

        var productTitleNode = productNode.SelectSingleNode(".//a[contains(@class, 'product-item-link')]");
        var productPriceNode = productNode.SelectSingleNode(".//span[contains(@class, 'price-wrapper')]");
        if (productTitleNode == null || productPriceNode == null) return false;

        var price = decimal.TryParse(productPriceNode.GetAttributeValue("data-price-amount", "0"), out var priceValue)
            ? priceValue.ToString("F2")
            : "0.00";

        itemDetails = new ItemDetails
        {
            UniqueCode = productUniqueCode,
            Title = productTitleNode.InnerText.Trim(),
            Price = $"£{price}"
        };

        return true;
    }
}