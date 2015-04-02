defmodule George.RegistryTest do
  use ExUnit.Case, async: true

  setup do
    {:ok, registry} = George.Registry.start_link
    {:ok, registry: registry}
  end

  test "spawns buckets", %{registry: registry} do
    assert George.Registry.lookup(registry, "http://www.railslove.com") == :error

    George.Registry.create(registry, "http://www.railslove.com")
    assert {:ok, page} = George.Registry.lookup(registry, "http://www.railslove.com")

    George.Page.add(page, "test@test.com")
    assert George.Page.all(page) == ["test@test.com"]
  end

  test "removes page on exit", %{registry: registry} do
    George.Registry.create(registry, "http://www.railslove.com")
    {:ok, page} = George.Registry.lookup(registry, "http://www.railslove.com")
    Agent.stop(page)
    assert George.Registry.lookup(registry, "http://www.railslove.com") == :error
  end
end
