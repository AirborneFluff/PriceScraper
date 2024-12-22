using API.Models;

namespace API.Interfaces;

public interface IWebScraper
{
    Task<List<ItemDetails>> GetItemDetails(string uniqueCode);
}