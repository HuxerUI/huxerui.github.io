#include <huxerui/huxerui.h>

#include <utility>

using namespace huxerui;

[[huxerui::composable]]
View CounterSnippet() {
  auto count = UseState(0);

  return Column {
    Text::Format("Count: {}", count),
    Button("Increment").OnClick([count] { ++count; }),
  }.With(Spacing(12.0F));
}

[[huxerui::composable]]
View ControlledTextFieldSnippet() {
  auto value = UseState(TextEditingValue::FromText(""));

  return TextField(value)
      .Label("Name")
      .Validation(value->text.empty() ? ValidationResult::Invalid("A name is required.") : ValidationResult::Valid())
      .OnChanged([value](const TextEditingValue& next) { value = next; });
}

View ResourceSnippet(StringResource title, ImageResource cover, int unread_count) {
  return Column {
    Text::Format(title, unread_count),
    Button(UseString(title, unread_count)),
    Image(cover).Fit(ImageFit::Cover),
  };
}

View InteractionVisualSnippet() {
  Indication action_feedback {
    .hover = IndicationLayer {
      .fill = VisualFill(Color::Rgb(255, 255, 255, 0.10F)),
      .placement = IndicationPlacement::AboveContent,
    },
    .press = IndicationLayer {
      .fill = VisualFill(Color::Rgb(255, 255, 255, 0.18F)),
      .placement = IndicationPlacement::AboveContent,
    },
    .ripple = RippleEffect {
      .color = Color::Rgb(255, 255, 255, 0.24F),
    },
  };

  return Button("Run").OnClick([] {}).With(action_feedback);
}

struct DocumentationRoute {
  enum class Kind {
    Article,
    Settings,
  } kind;
  int id = 0;

  bool operator==(const DocumentationRoute&) const = default;
};

View NavigationRootSnippet() {
  return Text("Home");
}

View ResolveDocumentationRoute(const DocumentationRoute& route) {
  if (route.kind == DocumentationRoute::Kind::Article) {
    return Text::Format("Article {}", route.id);
  }
  return Text("Settings");
}

[[huxerui::composable]]
View RoutedNavigationSnippet() {
  auto path = UseState(NavigationPath<DocumentationRoute>{});
  return NavigationStack(NavigationRootSnippet, path, ResolveDocumentationRoute);
}

View AppSnippet() {
  return CounterSnippet();
}
