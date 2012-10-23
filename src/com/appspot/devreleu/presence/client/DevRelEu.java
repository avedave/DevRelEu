package com.appspot.devreleu.presence.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.VerticalPanel;


public class DevRelEu implements EntryPoint {

	public void onModuleLoad() {
		VerticalPanel mainVerticalPanel = new VerticalPanel();
		RootPanel.get().add(mainVerticalPanel);
		HTML header = new HTML("Developer Relations resources");
		mainVerticalPanel.add(header);
		
	}
}
